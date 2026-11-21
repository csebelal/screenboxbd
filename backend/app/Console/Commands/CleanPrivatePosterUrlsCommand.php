<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Movie;
use App\Models\Channel;
use App\Services\TmdbService;
use Illuminate\Support\Str;

class CleanPrivatePosterUrlsCommand extends Command
{
    protected $signature = 'movies:clean-private-posters';
    protected $description = 'Clean all private network IPs (172.16.x, 192.168.x) from movie and channel poster URLs';

    public function handle(TmdbService $tmdb)
    {
        $this->info("=== Scanning for private IP poster URLs ===");

        $movies = Movie::where(function ($q) {
            $q->where('poster_url', 'like', '%172.16.%')
              ->orWhere('poster_url', 'like', '%192.168.%')
              ->orWhere('poster_url', 'like', '%10.%')
              ->orWhere('poster_url', 'like', '%127.0.0.1%')
              ->orWhere('backdrop_url', 'like', '%172.16.%')
              ->orWhere('backdrop_url', 'like', '%192.168.%');
        })->get();

        $this->info("Found {$movies->count()} movies with private network poster/backdrop URLs.");

        $fixedWithTmdb = 0;
        $resetToNull = 0;

        foreach ($movies as $movie) {
            // Clean title of video rip tags
            $rawTitle = $movie->title;
            $cleanTitle = preg_replace('/\b(1080p|720p|4k|2160p|bluray|brrip|web-dl|webrip|dvdrip|dvd|hdrip|x264|x265|hevc|aac|uncut|dual audio)\b/i', '', $rawTitle);
            $cleanTitle = preg_replace('/\s*\(?\d{4}\)?\s*/', ' ', $cleanTitle);
            $cleanTitle = trim(preg_replace('/\s+/', ' ', $cleanTitle));

            $foundTmdb = false;
            try {
                $searchRes = $tmdb->searchMovies($cleanTitle);
                if (!empty($searchRes['results'])) {
                    $best = $searchRes['results'][0];
                    if (!empty($best['poster_path'])) {
                        $movie->poster_url = "https://image.tmdb.org/t/p/w500" . $best['poster_path'];
                        if (!empty($best['backdrop_path'])) {
                            $movie->backdrop_url = "https://image.tmdb.org/t/p/original" . $best['backdrop_path'];
                        }
                        if (empty($movie->tmdb_id)) {
                            // Only set tmdb_id if no other movie has it
                            if (!Movie::where('tmdb_id', $best['id'])->where('id', '!=', $movie->id)->exists()) {
                                $movie->tmdb_id = $best['id'];
                            }
                        }
                        $foundTmdb = true;
                        $fixedWithTmdb++;
                        $this->line("  [TMDB MATCH] '{$rawTitle}' -> '{$best['title']}' ({$movie->poster_url})");
                    }
                }
            } catch (\Throwable $e) {}

            if (!$foundTmdb) {
                $movie->poster_url = null;
                if ($movie->backdrop_url && (str_contains($movie->backdrop_url, '172.16.') || str_contains($movie->backdrop_url, '192.168.'))) {
                    $movie->backdrop_url = null;
                }
                $resetToNull++;
                $this->line("  [RESET TO NULL] '{$rawTitle}' (no TMDB poster found)");
            }

            $movie->save();
        }

        // Channels check
        $channels = Channel::where(function ($q) {
            $q->where('logo_url', 'like', '%172.16.%')
              ->orWhere('logo_url', 'like', '%192.168.%');
        })->get();

        foreach ($channels as $ch) {
            $ch->logo_url = null;
            $ch->save();
        }

        $this->info("Completed! TMDB matched: {$fixedWithTmdb}, Reset to null: {$resetToNull}");

        $remaining = Movie::where(function ($q) {
            $q->where('poster_url', 'like', '%172.16.%')
              ->orWhere('poster_url', 'like', '%192.168.%');
        })->count();

        $this->info("Remaining movies with private poster URLs: {$remaining}");
        return 0;
    }
}
