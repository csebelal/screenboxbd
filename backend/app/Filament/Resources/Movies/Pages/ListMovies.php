<?php

namespace App\Filament\Resources\Movies\Pages;

use App\Filament\Resources\Movies\MovieResource;
use App\Models\Movie;
use App\Models\MovieStream;
use App\Services\BdixFtpResolverService;
use App\Services\TmdbService;
use App\Services\YtsTorrentService;
use Filament\Actions\Action;
use Filament\Actions\ActionGroup;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class ListMovies extends ListRecords
{
    protected static string $resource = MovieResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // 1. TMDB 1-Click Search & Import
            Action::make('importTmdb')
                ->label('Import from TMDB')
                ->icon('heroicon-m-arrow-down-tray')
                ->color('primary')
                ->modalHeading('TMDB Movie Metadata Importer')
                ->modalDescription('Enter a numeric TMDB ID (e.g. 550 for Fight Club, 872906 for Jawan) or movie title to search and import instantly.')
                ->form([
                    TextInput::make('query_or_id')
                        ->label('TMDB ID or Movie Title')
                        ->required()
                        ->placeholder('e.g. 872906 or Toofan')
                        ->helperText('Numeric ID imports directly. Text search matches the closest title on themoviedb.org.'),
                    Toggle::make('auto_attach_embeds')
                        ->label('Auto-Generate Multi-Server Embeds')
                        ->helperText('Adds VidLink VIP, Embed.su, and AutoEmbed clean links automatically if none exist.')
                        ->default(true),
                ])
                ->action(function (array $data, TmdbService $tmdb): void {
                    try {
                        $input = trim($data['query_or_id']);
                        if (is_numeric($input)) {
                            $tmdbId = (int) $input;
                        } else {
                            $searchRes = $tmdb->searchMovies($input);
                            $results = $searchRes['results'] ?? [];
                            if (empty($results)) {
                                throw new \RuntimeException("No TMDB movie found matching '{$input}'.");
                            }
                            $tmdbId = (int) $results[0]['id'];
                        }

                        $movie = $tmdb->importMovieById($tmdbId);

                        // Attach embed servers if requested and no streams exist
                        if (!empty($data['auto_attach_embeds']) && $movie->streams()->count() === 0) {
                            $embedResolver = app(\App\Services\EmbedResolverService::class);
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
                        }

                        Notification::make()
                            ->title('Movie Imported Successfully')
                            ->body("Imported '{$movie->title}' (TMDB: {$movie->tmdb_id}) with rating {$movie->rating} ★")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Import Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // 2. Quick Add Bangla Natok / Telefilm
            Action::make('addBanglaNatok')
                ->label('+ Add Bangla Natok')
                ->icon('heroicon-m-sparkles')
                ->color('warning')
                ->modalHeading('Quick Add Bangla Natok / Telefilm')
                ->modalDescription('Add single-episode Bengali drama, Eid special natok, or telefilm. YouTube URLs automatically extract HD thumbnail and embed player.')
                ->form([
                    TextInput::make('title')
                        ->label('Natok Title (বাংলা / English)')
                        ->required()
                        ->placeholder('e.g. বুকের খাঁচা | Buker Khacha')
                        ->helperText('Enter the full title of the drama.'),
                    TextInput::make('stream_url')
                        ->label('Stream or YouTube URL')
                        ->required()
                        ->placeholder('https://www.youtube.com/watch?v=... or https://.../stream.m3u8')
                        ->helperText('Paste a YouTube link, HLS .m3u8 stream, or direct BDIX MP4 video link.'),
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
                        ->label('Lead Cast / Actors')
                        ->placeholder('e.g. Afran Nisho, Mehazabien Chowdhury'),
                    TextInput::make('director')
                        ->label('Director')
                        ->placeholder('e.g. Kajal Arefin Ome, Mizanur Rahman Aryan'),
                    TextInput::make('poster_url')
                        ->label('Poster Image URL (Optional)')
                        ->placeholder('Leave empty to auto-extract from YouTube')
                        ->helperText('If using YouTube, high-res thumbnail is auto-fetched if left blank.'),
                    TextInput::make('duration_minutes')
                        ->label('Duration (Minutes)')
                        ->numeric()
                        ->default(45),
                    DatePicker::make('release_date')
                        ->label('Release Date')
                        ->default(now()),
                    Textarea::make('overview')
                        ->label('Synopsis / Description')
                        ->placeholder('Brief story overview...')
                        ->rows(2),
                    Toggle::make('is_featured')
                        ->label('Featured in Bangla OTT Rail')
                        ->default(true),
                    Toggle::make('is_hero_slider')
                        ->label('Feature in Home Hero Slider')
                        ->default(false),
                ])
                ->action(function (array $data): void {
                    try {
                        $title = trim($data['title']);
                        $streamUrl = trim($data['stream_url']);
                        
                        // Extract YouTube ID if applicable
                        $youtubeId = null;
                        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $streamUrl, $matches)) {
                            $youtubeId = $matches[1];
                        }

                        $posterUrl = !empty($data['poster_url']) ? $data['poster_url'] : null;
                        $backdropUrl = null;

                        if ($youtubeId) {
                            if (!$posterUrl) {
                                $posterUrl = "https://img.youtube.com/vi/{$youtubeId}/maxresdefault.jpg";
                            }
                            $backdropUrl = "https://img.youtube.com/vi/{$youtubeId}/hqdefault.jpg";
                            $finalStreamUrl = "https://www.youtube.com/embed/{$youtubeId}?autoplay=1&rel=0";
                            $streamType = 'embed';
                            $serverName = 'Server 1: YouTube HD (Fast CDN)';
                        } elseif (str_contains(strtolower($streamUrl), '.m3u8')) {
                            $finalStreamUrl = $streamUrl;
                            $streamType = 'hls';
                            $serverName = 'Server 1: Live HLS Stream';
                        } else {
                            $finalStreamUrl = $streamUrl;
                            $streamType = 'mp4';
                            $serverName = 'Server 1: Direct Video';
                        }

                        $slug = Str::slug($title);
                        if (empty($slug)) {
                            $slug = 'natok-' . time();
                        }
                        if (Movie::where('slug', $slug)->exists()) {
                            $slug .= '-' . time();
                        }

                        $castList = [];
                        if (!empty($data['actors'])) {
                            foreach (explode(',', $data['actors']) as $actor) {
                                $actor = trim($actor);
                                if ($actor) {
                                    $castList[] = ['name' => $actor, 'character' => 'Lead Cast', 'avatar' => null];
                                }
                            }
                        }

                        $movie = Movie::create([
                            'title' => $title,
                            'slug' => $slug,
                            'overview' => $data['overview'] ?? "Popular Bengali drama starring " . ($data['actors'] ?? 'leading actors') . ".",
                            'poster_url' => $posterUrl,
                            'backdrop_url' => $backdropUrl ?: $posterUrl,
                            'trailer_url' => $youtubeId ? "https://www.youtube.com/watch?v={$youtubeId}" : null,
                            'release_date' => $data['release_date'] ?? now()->toDateString(),
                            'duration_minutes' => (int) ($data['duration_minutes'] ?? 45),
                            'rating' => 8.5,
                            'genres' => ['Bangla Natok', 'Telefilm', 'Drama', 'Bengali'],
                            'ott_platform' => $data['ott_platform'] ?? 'youtube',
                            'cast' => $castList,
                            'is_published' => true,
                            'is_featured' => !empty($data['is_featured']),
                            'is_hero_slider' => !empty($data['is_hero_slider']),
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
                            ->title('Bangla Natok Added Successfully')
                            ->body("Added '{$movie->title}' with {$serverName} stream attached.")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Failed to Add Natok')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // 3. Batch Sync Trending Movies
            Action::make('syncTrending')
                ->label('Sync Trending')
                ->icon('heroicon-m-fire')
                ->color('danger')
                ->modalHeading('Batch Sync Trending TMDB Movies')
                ->modalDescription('Pulls the current highest-rated and trending movies from TMDB with full cast, backdrop, and multi-server playback.')
                ->form([
                    Select::make('count')
                        ->label('Number of Movies to Sync')
                        ->options([
                            '5' => 'Top 5 Movies',
                            '10' => 'Top 10 Movies',
                            '15' => 'Top 15 Movies',
                            '20' => 'Top 20 Movies',
                        ])
                        ->default('10')
                        ->required(),
                    Select::make('time_window')
                        ->label('Time Window')
                        ->options([
                            'day' => 'Trending Today (Hot Releases)',
                            'week' => 'Trending This Week',
                        ])
                        ->default('day')
                        ->required(),
                ])
                ->action(function (array $data, TmdbService $tmdb): void {
                    try {
                        $count = (int) $data['count'];
                        $window = $data['time_window'] ?? 'day';
                        $trending = $tmdb->getTrendingMovies($window);
                        $items = $trending['results'] ?? [];

                        if (empty($items)) {
                            throw new \RuntimeException("No trending movies returned from TMDB API.");
                        }

                        $imported = 0;
                        $embedResolver = app(\App\Services\EmbedResolverService::class);

                        foreach (array_slice($items, 0, $count) as $item) {
                            try {
                                $movie = $tmdb->importMovieById($item['id']);
                                if ($movie->streams()->count() === 0) {
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
                                }
                                $imported++;
                            } catch (\Throwable) {
                                // Skip individual failures
                            }
                        }

                        Notification::make()
                            ->title('Trending Movies Synced')
                            ->body("Successfully synced {$imported} trending titles with multi-server playback!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Sync Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // 4. BDIX FTP Scanner & Auto-Linker
            Action::make('scanBdix')
                ->label('BDIX FTP Scan')
                ->icon('heroicon-m-bolt')
                ->color('success')
                ->modalHeading('BDIX FTP Open Directory Scanner')
                ->modalDescription('Crawl a local ISP FTP server directory or link a direct video file. Matches TMDB metadata and links Server 1 (BDIX Ultra-Speed).')
                ->form([
                    TextInput::make('url')
                        ->label('BDIX FTP or Video URL')
                        ->required()
                        ->placeholder('http://circleftp.net/Hollywood/2024/ or direct .mkv/.mp4 URL')
                        ->helperText('Supports direct media file URLs or HTTP open directory folders.'),
                    TextInput::make('limit')
                        ->label('Max Files to Process')
                        ->numeric()
                        ->default(15),
                    Toggle::make('auto_import')
                        ->label('Auto-Import Missing Movies from TMDB')
                        ->helperText('If movie is not in database, automatically creates it via TMDB metadata.')
                        ->default(true),
                ])
                ->action(function (array $data, BdixFtpResolverService $resolver): void {
                    try {
                        $url = trim($data['url']);
                        $limit = (int) ($data['limit'] ?? 15);
                        $autoImport = (bool) ($data['auto_import'] ?? true);

                        if (preg_match('/\.(mp4|mkv|m3u8|avi)$/i', $url)) {
                            $files = [$url];
                        } else {
                            $files = $resolver->crawlOpenDirectory($url, $limit);
                        }

                        if (empty($files)) {
                            throw new \RuntimeException("No media files found at this URL or server unreachable.");
                        }

                        $linked = 0;
                        foreach ($files as $fileUrl) {
                            $parsed = $resolver->parseReleaseFilename($fileUrl);
                            $movie = $resolver->matchAndAttachMovie($fileUrl, $parsed['title'], $autoImport);
                            if ($movie) {
                                $linked++;
                            }
                        }

                        Notification::make()
                            ->title('BDIX Scan Complete')
                            ->body("Successfully attached high-speed BDIX streams to {$linked}/" . count($files) . " movies!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('BDIX Scan Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // 5. YTS Torrent Sync
            Action::make('syncYts')
                ->label('Sync YTS Torrents')
                ->icon('heroicon-m-arrow-down-tray')
                ->color('gray')
                ->modalHeading('Ingest YTS Torrents & Magnet Links')
                ->modalDescription('Fetches popular movie releases from YTS API with 720p, 1080p, 2160p torrents and tracker-enhanced magnet download links.')
                ->form([
                    Select::make('limit')
                        ->label('Movies to Sync')
                        ->options([
                            '5' => '5 Releases',
                            '10' => '10 Releases',
                            '15' => '15 Releases',
                            '20' => '20 Releases',
                        ])
                        ->default('10')
                        ->required(),
                    Select::make('sort')
                        ->label('Sort Criteria')
                        ->options([
                            'download_count' => 'Most Downloaded (High Seeds)',
                            'date_added' => 'Latest Torrent Uploads',
                            'rating' => 'Top Rated',
                        ])
                        ->default('download_count')
                        ->required(),
                ])
                ->action(function (array $data, YtsTorrentService $yts): void {
                    try {
                        $limit = (int) $data['limit'];
                        $sort = $data['sort'] ?? 'download_count';
                        $movies = $yts->getLatestMovies($limit, 1, $sort);

                        if (empty($movies)) {
                            throw new \RuntimeException("No releases returned from YTS API.");
                        }

                        $synced = 0;
                        foreach ($movies as $raw) {
                            $movie = $yts->syncMovie($raw);
                            if ($movie) {
                                $synced++;
                            }
                        }

                        Notification::make()
                            ->title('YTS Torrents Synced')
                            ->body("Successfully synced {$synced}/" . count($movies) . " movie torrent magnets!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('YTS Sync Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            CreateAction::make()->label('+ New Movie'),
        ];
    }
}
