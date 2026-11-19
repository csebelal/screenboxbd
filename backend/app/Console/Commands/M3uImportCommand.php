<?php

namespace App\Console\Commands;

use App\Services\M3uParserService;
use Illuminate\Console\Command;

class M3uImportCommand extends Command
{
    protected $signature = 'm3u:import 
                            {source : Local file path or remote HTTP/HTTPS URL} 
                            {--category= : Default category if not specified in playlist} 
                            {--country=BD : Default country code} 
                            {--limit= : Limit the number of channels to import} 
                            {--fresh : Wipe existing channels and streams before importing} 
                            {--dry-run : Parse playlist without saving to database}';

    protected $description = 'Import IPTV channels and streams from an M3U/M3U8 playlist';

    public function handle(M3uParserService $parser): int
    {
        $source = $this->argument('source');
        $category = $this->option('category');
        $country = $this->option('country') ?: 'BD';
        $limit = $this->option('limit');
        $fresh = (bool) $this->option('fresh');
        $dryRun = (bool) $this->option('dry-run');

        $this->info("Processing M3U playlist: {$source}");
        if ($dryRun) {
            $this->warn("Executing in DRY-RUN mode. No changes will be written to database.");
        }

        if ($fresh && !$dryRun) {
            $this->warn("Clearing existing TV channels and streams for a fresh import...");
            \App\Models\ChannelStream::query()->delete();
            \App\Models\Channel::query()->delete();
            $this->info("Existing channels and streams successfully cleared.");
        }

        $options = [
            'default_category' => $category ?: 'General',
            'default_country' => $country,
            'dry_run' => $dryRun,
        ];

        if ($limit) {
            $options['limit'] = (int) $limit;
        }

        $startTime = microtime(true);
        $results = $parser->import($source, $options);
        $duration = round(microtime(true) - $startTime, 2);

        $this->newLine();
        $this->info("========================================");
        $this->info("         M3U Import Summary");
        $this->info("========================================");
        $this->line("  Total Items Parsed:    {$results['total_parsed']}");
        $this->line("  Channels Created:      {$results['channels_created']}");
        $this->line("  Channels Updated:      {$results['channels_updated']}");
        $this->line("  Streams Added:         {$results['streams_created']}");
        $this->line("  Categories Created:    {$results['categories_created']}");
        $this->line("  Skipped:               {$results['skipped']}");
        $this->line("  Errors:                {$results['errors']}");
        $this->line("  Duration:              {$duration}s");
        $this->info("========================================");

        return self::SUCCESS;
    }
}
