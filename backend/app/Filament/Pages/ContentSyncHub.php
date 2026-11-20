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
            // 1. TMDB Series Importer (Seasons & Episodes)
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
        ];
    }
}
