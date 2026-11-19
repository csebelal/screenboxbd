<?php

namespace App\Console\Commands;

use App\Models\EpisodeStream;
use App\Models\Movie;
use App\Models\MovieStream;
use App\Services\EmbedResolverService;
use Illuminate\Console\Command;

class CleanDummyStreamsCommand extends Command
{
    protected $signature = 'streams:clean-dummy';

    protected $description = 'Purge all dummy test streams (Mux test, Akamaized, BigBuckBunny) and ensure movies have real TMDB embed / BDIX streams';

    public function handle(EmbedResolverService $embedResolver): int
    {
        $this->info("=================================================");
        $this->info("   ScreenBoxBD Stream Sanitizer & Real-Linker");
        $this->info("=================================================");

        // 1. Delete dummy test streams from movie_streams
        $dummyPatterns = ['%test-streams.mux.dev%', '%akamaized%', '%BigBuckBunny%'];

        $movieDummyQuery = MovieStream::where(function ($q) use ($dummyPatterns) {
            foreach ($dummyPatterns as $pattern) {
                $q->orWhere('stream_url', 'LIKE', $pattern);
            }
        });

        $deletedMovieStreams = $movieDummyQuery->count();
        $movieDummyQuery->delete();
        $this->info("✓ Purged {$deletedMovieStreams} dummy test streams from movie_streams table.");

        // 2. Delete dummy test streams from episode_streams
        $episodeDummyQuery = EpisodeStream::where(function ($q) use ($dummyPatterns) {
            foreach ($dummyPatterns as $pattern) {
                $q->orWhere('stream_url', 'LIKE', $pattern);
            }
        });

        $deletedEpisodeStreams = $episodeDummyQuery->count();
        $episodeDummyQuery->delete();
        $this->info("✓ Purged {$deletedEpisodeStreams} dummy test streams from episode_streams table.");

        // 3. Populate real multi-server embeds for movies that currently have 0 streams
        $moviesWithoutStreams = Movie::whereDoesntHave('streams')->get();
        $this->info("Found {$moviesWithoutStreams->count()} movies without streams. Populating genuine TMDB embed servers...");

        $populated = 0;
        foreach ($moviesWithoutStreams as $movie) {
            if (!$movie->tmdb_id) {
                continue;
            }

            $servers = $embedResolver->getMovieEmbedServers($movie->tmdb_id, $movie->imdb_id);
            foreach ($servers as $srv) {
                MovieStream::create([
                    'movie_id' => $movie->id,
                    'server_name' => $srv['server_name'],
                    'stream_type' => 'embed',
                    'stream_url' => $srv['stream_url'],
                    'quality' => $srv['quality'],
                    'priority' => $srv['priority'],
                ]);
            }
            $populated++;
        }

        $this->info("✓ Successfully populated real embed servers for {$populated} movies!");

        // 4. Verification summary
        $totalMovies = Movie::count();
        $totalStreams = MovieStream::count();
        $moviesWithStreams = Movie::has('streams')->count();

        $this->newLine();
        $this->info("=================================================");
        $this->info("               Sanitization Summary");
        $this->info("=================================================");
        $this->line(" Total Movies in DB:              {$totalMovies}");
        $this->line(" Movies with Active Real Streams: {$moviesWithStreams}");
        $this->line(" Total Real Streams in DB:        {$totalStreams}");
        $this->info("=================================================");

        return self::SUCCESS;
    }
}
