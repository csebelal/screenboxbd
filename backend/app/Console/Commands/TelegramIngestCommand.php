<?php

namespace App\Console\Commands;

use App\Services\TelegramIngestService;
use Illuminate\Console\Command;

class TelegramIngestCommand extends Command
{
    protected $signature = 'telegram:ingest 
                            {title : Release title or message text e.g. "Toofan.2024.1080p"} 
                            {--url= : Direct Telegram link or post URL} 
                            {--quality=1080p : Video quality}';

    protected $description = 'Ingest a movie release from Telegram post text or link';

    public function handle(TelegramIngestService $telegram): int
    {
        $title = $this->argument('title');
        $url = $this->option('url');
        $quality = $this->option('quality') ?: '1080p';

        $this->info("Processing Telegram release: '{$title}'...");

        $movie = $telegram->ingestRelease($title, $url, $quality);

        if ($movie) {
            $this->info("✓ Successfully linked release to Movie: '{$movie->title}' (ID: {$movie->id}, TMDB: {$movie->tmdb_id})");
            $this->line("  Rating: {$movie->rating} | Duration: {$movie->duration_minutes}m");
            if ($url) {
                $this->line("  Telegram Link: {$url}");
            }
            return self::SUCCESS;
        }

        $this->error("Failed to match release with TMDB movie.");
        return self::FAILURE;
    }
}
