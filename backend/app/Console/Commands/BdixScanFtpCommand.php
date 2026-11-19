<?php

namespace App\Console\Commands;

use App\Services\BdixFtpResolverService;
use Illuminate\Console\Command;

class BdixScanFtpCommand extends Command
{
    protected $signature = 'bdix:scan-ftp 
                            {url : BDIX FTP or Open Directory HTTP URL} 
                            {--limit=25 : Maximum media files to crawl} 
                            {--auto-import : Automatically import matched TMDB movies}';

    protected $description = 'Crawl BDIX FTP / Open Directory server and auto-attach high-speed local streams to movies';

    public function handle(BdixFtpResolverService $resolver): int
    {
        $url = $this->argument('url');
        $limit = (int) $this->option('limit') ?: 25;
        $autoImport = (bool) $this->option('auto-import');

        $this->info("=================================================");
        $this->info("        BDIX FTP Open Directory Scanner");
        $this->info("=================================================");
        $this->line(" Target URL:   {$url}");
        $this->line(" Limit:        {$limit} files");
        $this->line(" Auto Import:  " . ($autoImport ? "YES (Will create missing movies via TMDB)" : "NO (Only matches existing DB movies)"));
        $this->newLine();

        // Check if single direct file URL was passed
        if (preg_match('/\.(mp4|mkv|m3u8|avi)$/i', $url)) {
            $files = [$url];
        } else {
            $this->info("Crawling directory index for media files...");
            $files = $resolver->crawlOpenDirectory($url, $limit);
        }

        if (empty($files)) {
            $this->warn("No media files (.mp4, .mkv, .m3u8) found at this URL or directory was unreachable.");
            return self::FAILURE;
        }

        $this->info("Found " . count($files) . " media files. Processing releases...");

        $successCount = 0;
        foreach ($files as $fileUrl) {
            $parsed = $resolver->parseReleaseFilename($fileUrl);
            $this->line("• Release: <comment>{$parsed['original_filename']}</comment>");
            $this->line("  Clean Title: {$parsed['title']}" . ($parsed['year'] ? " ({$parsed['year']})" : "") . " [{$parsed['quality']}]");

            $movie = $resolver->matchAndAttachMovie($fileUrl, $parsed['title'], $autoImport);

            if ($movie) {
                $this->info("  ✓ Attached to Movie: '{$movie->title}' (ID: {$movie->id}) as Server 1 (BDIX Ultra-Speed)");
                $successCount++;
            } else {
                $this->warn("  ✗ Could not match with TMDB movie or movie not found.");
            }
            $this->newLine();
        }

        $this->info("=================================================");
        $this->info(" Completed! Successfully linked {$successCount}/" . count($files) . " BDIX stream servers.");
        $this->info("=================================================");

        return self::SUCCESS;
    }
}
