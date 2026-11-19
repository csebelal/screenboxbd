<?php

namespace App\Filament\Pages;

use App\Models\Episode;
use App\Models\Movie;
use App\Models\MovieStream;
use App\Models\Season;
use App\Models\Series;
use App\Services\BdixFtpResolverService;
use App\Services\EmbedResolverService;
use App\Services\TelegramIngestService;
use App\Services\TmdbService;
use App\Services\YtsTorrentService;
use Filament\Actions\Action;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Str;

class ContentSyncHub extends Page
{
    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-arrow-path-rounded-square';

    protected static string | \UnitEnum | null $navigationGroup = 'Video On Demand';

    protected static ?string $navigationLabel = 'Content Automation Hub';

    protected static ?string $title = 'Content Automation & Sync Center';

    protected static ?int $navigationSort = 0;

    protected string $view = 'filament.pages.content-sync-hub';

    public function getStats(): array
    {
        $totalMovies = Movie::count();
        $totalSeries = Series::count();
        $totalEpisodes = Episode::count();
        $natokCount = Movie::where(function ($q) {
            $q->whereJsonContains('genres', 'Bangla Natok')
              ->orWhereJsonContains('genres', 'Natok')
              ->orWhereJsonContains('genres', 'Telefilm')
              ->orWhereIn('ott_platform', ['chorki', 'toffee', 'bongo', 'cinemawala', 'cmv', 'youtube']);
        })->count();
        
        $bdixStreams = MovieStream::where('server_name', 'LIKE', '%BDIX%')->count();
        $torrentMagnets = Movie::whereNotNull('download_sources')->count();

        return [
            'movies' => $totalMovies,
            'series' => $totalSeries,
            'episodes' => $totalEpisodes,
            'natok' => $natokCount,
            'bdix' => $bdixStreams,
            'torrents' => $torrentMagnets,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            // 1. TMDB Movie Importer
            Action::make('importMovie')
                ->label('Import Movie (TMDB)')
                ->icon('heroicon-m-film')
                ->color('primary')
                ->modalHeading('Import Movie from TMDB')
                ->modalDescription('Search by movie title or enter numeric TMDB ID.')
                ->form([
                    TextInput::make('query_or_id')
                        ->label('Movie Title or TMDB ID')
                        ->required()
                        ->placeholder('e.g. Toofan or 872906'),
                    Toggle::make('auto_attach_embeds')
                        ->label('Auto-Attach 6+ Embed Servers')
                        ->default(true),
                ])
                ->action(function (array $data, TmdbService $tmdb, EmbedResolverService $embeds): void {
                    try {
                        $input = trim($data['query_or_id']);
                        if (is_numeric($input)) {
                            $tmdbId = (int) $input;
                        } else {
                            $search = $tmdb->searchMovies($input);
                            if (empty($search['results'])) {
                                throw new \RuntimeException("No TMDB movie found matching '{$input}'.");
                            }
                            $tmdbId = (int) $search['results'][0]['id'];
                        }

                        $movie = $tmdb->importMovieById($tmdbId);

                        if (!empty($data['auto_attach_embeds']) && $movie->streams()->count() === 0) {
                            $servers = $embeds->getMovieEmbedServers($movie->tmdb_id, $movie->imdb_id);
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
                        }

                        Notification::make()
                            ->title('Movie Imported')
                            ->body("Successfully imported '{$movie->title}' (Rating: {$movie->rating} ★)")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()->title('Import Error')->body($e->getMessage())->danger()->send();
                    }
                }),

            // 2. TMDB Series Importer (Seasons & Episodes)
            Action::make('importSeries')
                ->label('Import Series & Episodes')
                ->icon('heroicon-m-tv')
                ->color('success')
                ->modalHeading('Import Complete TV / Web Series')
                ->modalDescription('Fetches series metadata, cast, and loops through all seasons and episodes from TMDB.')
                ->form([
                    TextInput::make('query_or_id')
                        ->label('Series Title or TMDB ID')
                        ->required()
                        ->placeholder('e.g. Stranger Things or 66732'),
                ])
                ->action(function (array $data, TmdbService $tmdb): void {
                    try {
                        $input = trim($data['query_or_id']);
                        if (is_numeric($input)) {
                            $tmdbId = (int) $input;
                        } else {
                            $search = $tmdb->searchTvSeries($input);
                            if (empty($search['results'])) {
                                throw new \RuntimeException("No TV series found matching '{$input}'.");
                            }
                            $tmdbId = (int) $search['results'][0]['id'];
                        }

                        $series = $tmdb->importSeriesWithSeasons($tmdbId);
                        $series->load('seasons.episodes');
                        $seasonsCount = $series->seasons->count();
                        $episodesCount = $series->seasons->sum(fn ($s) => $s->episodes->count());

                        Notification::make()
                            ->title('Web Series Imported')
                            ->body("Imported '{$series->title}' with {$seasonsCount} Seasons and {$episodesCount} Episodes!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()->title('Series Import Error')->body($e->getMessage())->danger()->send();
                    }
                }),

            // 3. Quick Add Bangla Natok
            Action::make('addNatok')
                ->label('+ Add Bangla Natok')
                ->icon('heroicon-m-sparkles')
                ->color('warning')
                ->modalHeading('Quick Add Bangla Natok / Telefilm')
                ->modalDescription('Add single-episode drama or telefilm. YouTube URLs automatically extract HD thumbnail and embed player.')
                ->form([
                    TextInput::make('title')
                        ->label('Natok Title (বাংলা / English)')
                        ->required()
                        ->placeholder('e.g. বুকের খাঁচা | Buker Khacha'),
                    TextInput::make('stream_url')
                        ->label('Stream or YouTube URL')
                        ->required()
                        ->placeholder('https://www.youtube.com/watch?v=... or https://.../stream.m3u8'),
                    Select::make('ott_platform')
                        ->label('Platform / YouTube Channel')
                        ->options([
                            'youtube' => 'YouTube (বাংলা নাটক)',
                            'cinemawala' => 'Cinemawala (সিনেমাওয়ালা)',
                            'chorki' => 'Chorki (চরকি)',
                            'toffee' => 'Toffee (টফি)',
                            'bongo' => 'Bongo BD (বঙ্গ)',
                            'cmv' => 'CMV Drama',
                            'deeptoplay' => 'DeeptoPlay',
                            'hoichoi' => 'Hoichoi',
                            'bioscope' => 'Bioscope',
                        ])
                        ->default('youtube')
                        ->required(),
                    TextInput::make('actors')
                        ->label('Lead Cast')
                        ->placeholder('e.g. Afran Nisho, Mehazabien Chowdhury'),
                    TextInput::make('poster_url')
                        ->label('Poster URL (Leave empty for YouTube thumbnail)'),
                    TextInput::make('duration_minutes')
                        ->label('Duration (Minutes)')
                        ->numeric()
                        ->default(45),
                    Toggle::make('is_featured')
                        ->label('Featured in Bangla OTT Rail')
                        ->default(true),
                ])
                ->action(function (array $data): void {
                    try {
                        $title = trim($data['title']);
                        $streamUrl = trim($data['stream_url']);
                        
                        $youtubeId = null;
                        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $streamUrl, $matches)) {
                            $youtubeId = $matches[1];
                        }

                        $posterUrl = !empty($data['poster_url']) ? $data['poster_url'] : null;
                        if ($youtubeId) {
                            if (!$posterUrl) {
                                $posterUrl = "https://img.youtube.com/vi/{$youtubeId}/maxresdefault.jpg";
                            }
                            $finalStreamUrl = "https://www.youtube.com/embed/{$youtubeId}?autoplay=1&rel=0";
                            $streamType = 'embed';
                            $serverName = 'Server 1: YouTube HD';
                        } elseif (str_contains(strtolower($streamUrl), '.m3u8')) {
                            $finalStreamUrl = $streamUrl;
                            $streamType = 'hls';
                            $serverName = 'Server 1: Live HLS';
                        } else {
                            $finalStreamUrl = $streamUrl;
                            $streamType = 'mp4';
                            $serverName = 'Server 1: Direct Video';
                        }

                        $slug = Str::slug($title) ?: 'natok-' . time();
                        if (Movie::where('slug', $slug)->exists()) {
                            $slug .= '-' . time();
                        }

                        $movie = Movie::create([
                            'title' => $title,
                            'slug' => $slug,
                            'overview' => "Popular Bengali drama starring " . ($data['actors'] ?? 'leading actors') . ".",
                            'poster_url' => $posterUrl,
                            'backdrop_url' => $posterUrl,
                            'release_date' => now()->toDateString(),
                            'duration_minutes' => (int) ($data['duration_minutes'] ?? 45),
                            'rating' => 8.5,
                            'genres' => ['Bangla Natok', 'Telefilm', 'Drama', 'Bengali'],
                            'ott_platform' => $data['ott_platform'] ?? 'youtube',
                            'is_published' => true,
                            'is_featured' => !empty($data['is_featured']),
                        ]);

                        MovieStream::create([
                            'movie_id' => $movie->id,
                            'server_name' => $serverName,
                            'stream_type' => $streamType,
                            'stream_url' => $finalStreamUrl,
                            'quality' => '1080p',
                            'priority' => 1,
                        ]);

                        Notification::make()
                            ->title('Bangla Natok Added')
                            ->body("Added '{$movie->title}' successfully!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()->title('Failed to Add Natok')->body($e->getMessage())->danger()->send();
                    }
                }),

            // 4. Batch Sync Trending Movies
            Action::make('syncTrendingMovies')
                ->label('Sync Trending Movies')
                ->icon('heroicon-m-fire')
                ->color('danger')
                ->form([
                    Select::make('count')
                        ->options(['5' => 'Top 5', '10' => 'Top 10', '15' => 'Top 15', '20' => 'Top 20'])
                        ->default('10')
                        ->required(),
                ])
                ->action(function (array $data, TmdbService $tmdb, EmbedResolverService $embeds): void {
                    try {
                        $count = (int) $data['count'];
                        $trending = $tmdb->getTrendingMovies('day');
                        $items = $trending['results'] ?? [];
                        $imported = 0;

                        foreach (array_slice($items, 0, $count) as $item) {
                            try {
                                $movie = $tmdb->importMovieById($item['id']);
                                if ($movie->streams()->count() === 0) {
                                    $servers = $embeds->getMovieEmbedServers($movie->tmdb_id, $movie->imdb_id);
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
                                }
                                $imported++;
                            } catch (\Throwable) {}
                        }

                        Notification::make()
                            ->title('Trending Movies Synced')
                            ->body("Successfully synced {$imported} trending titles!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()->title('Sync Failed')->body($e->getMessage())->danger()->send();
                    }
                }),

            // 5. BDIX FTP Scanner
            Action::make('scanBdix')
                ->label('Scan BDIX FTP')
                ->icon('heroicon-m-bolt')
                ->color('success')
                ->form([
                    TextInput::make('url')
                        ->label('FTP or Open Directory URL')
                        ->required()
                        ->placeholder('http://circleftp.net/Hollywood/2024/ or direct video file'),
                    TextInput::make('limit')
                        ->numeric()
                        ->default(15),
                    Toggle::make('auto_import')
                        ->label('Auto-Import Missing Movies via TMDB')
                        ->default(true),
                ])
                ->action(function (array $data, BdixFtpResolverService $resolver): void {
                    try {
                        $url = trim($data['url']);
                        $limit = (int) ($data['limit'] ?? 15);
                        $autoImport = (bool) ($data['auto_import'] ?? true);

                        $files = preg_match('/\.(mp4|mkv|m3u8|avi)$/i', $url)
                            ? [$url]
                            : $resolver->crawlOpenDirectory($url, $limit);

                        if (empty($files)) {
                            throw new \RuntimeException("No media files found.");
                        }

                        $linked = 0;
                        foreach ($files as $fileUrl) {
                            $parsed = $resolver->parseReleaseFilename($fileUrl);
                            $movie = $resolver->matchAndAttachMovie($fileUrl, $parsed['title'], $autoImport);
                            if ($movie) $linked++;
                        }

                        Notification::make()
                            ->title('BDIX Scan Finished')
                            ->body("Linked {$linked} BDIX streams successfully!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()->title('BDIX Failed')->body($e->getMessage())->danger()->send();
                    }
                }),

            // 6. YTS Torrents Sync
            Action::make('syncYts')
                ->label('Sync YTS Torrents')
                ->icon('heroicon-m-arrow-down-tray')
                ->color('gray')
                ->form([
                    Select::make('limit')
                        ->options(['5' => '5 Releases', '10' => '10 Releases', '15' => '15 Releases'])
                        ->default('10')
                        ->required(),
                ])
                ->action(function (array $data, YtsTorrentService $yts): void {
                    try {
                        $movies = $yts->getLatestMovies((int) $data['limit'], 1, 'download_count');
                        $synced = 0;
                        foreach ($movies as $raw) {
                            if ($yts->syncMovie($raw)) $synced++;
                        }
                        Notification::make()
                            ->title('YTS Synced')
                            ->body("Synced {$synced} movie torrent magnets!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()->title('YTS Failed')->body($e->getMessage())->danger()->send();
                    }
                }),
        ];
    }
}
