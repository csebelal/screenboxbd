<?php

namespace App\Console\Commands;

use App\Services\YtsTorrentService;
use Illuminate\Console\Command;

class TorrentSyncYtsCommand extends Command
{
    protected $signature = 'torrent:sync-yts 
                            {--limit=15 : Number of movies to sync from YTS} 
                            {--sort=download_count : Sort by: download_count, date_added, rating}';

    protected $description = 'Ingest high-demand movies and offline torrent magnet links from YTS API';

    public function handle(YtsTorrentService $yts): int
    {
        $limit = (int) $this->option('limit') ?: 15;
        $sortBy = (string) $this->option('sort') ?: 'download_count';

        $this->info("=================================================");
        $this->info("         YTS Torrent & Magnet Sync Engine");
        $this->info("=================================================");
        $this->line(" Fetching top {$limit} releases (Sort: {$sortBy})...");
        $this->newLine();

        $movies = $yts->getLatestMovies($limit, 1, $sortBy);

        if (empty($movies)) {
            $this->warn("No movies returned from YTS API. Please verify network connectivity.");
            return self::FAILURE;
        }

        $this->info("Found " . count($movies) . " YTS movie releases. Syncing with TMDB & Database...");

        $synced = 0;
        foreach ($movies as $raw) {
            $title = $raw['title'] ?? 'Unknown';
            $year = $raw['year'] ?? '';
            $imdb = $raw['imdb_code'] ?? 'N/A';
            $torrentsCount = count($raw['torrents'] ?? []);

            $this->line("• Syncing: <comment>{$title} ({$year})</comment> [IMDb: {$imdb}] with {$torrentsCount} torrents");

            try {
                $movie = $yts->syncMovie($raw);
                if ($movie) {
                    $this->info("  ✓ Saved Movie ID: {$movie->id} (TMDB: {$movie->tmdb_id}) with " . count($movie->download_sources ?? []) . " download links");
                    $synced++;
                } else {
                    $this->warn("  ✗ Could not match with TMDB metadata.");
                }
            } catch (\Throwable $e) {
                $this->error("  Error syncing movie: " . $e->getMessage());
            }
        }

        $this->newLine();
        $this->info("=================================================");
        $this->info(" Completed! Successfully synced {$synced}/" . count($movies) . " movies with download sources.");
        $this->info("=================================================");

        return self::SUCCESS;
    }
}
