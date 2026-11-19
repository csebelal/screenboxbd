<?php

namespace App\Filament\Resources\Series\Pages;

use App\Filament\Resources\Series\SeriesResource;
use App\Models\Episode;
use App\Models\Season;
use App\Models\Series;
use App\Services\TmdbService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Str;

class ListSeries extends ListRecords
{
    protected static string $resource = SeriesResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // 1. TMDB 1-Click Series Auto-Populator (All Seasons & Episodes)
            Action::make('importTmdbSeries')
                ->label('Import Web Series')
                ->icon('heroicon-m-arrow-down-tray')
                ->color('primary')
                ->modalHeading('TMDB Web Series Auto-Populator')
                ->modalDescription('Enter a TV show title (e.g. Stranger Things, Taqdeer, Karagar) or TMDB ID (e.g. 66732, 110947). Auto-populates all seasons and episodes.')
                ->form([
                    TextInput::make('query_or_id')
                        ->label('TMDB ID or TV Show Title')
                        ->required()
                        ->placeholder('e.g. 66732 or Taqdeer')
                        ->helperText('Numeric ID imports directly. Title matches the best series on themoviedb.org.'),
                ])
                ->action(function (array $data, TmdbService $tmdb): void {
                    try {
                        $input = trim($data['query_or_id']);
                        if (is_numeric($input)) {
                            $tmdbId = (int) $input;
                        } else {
                            $searchRes = $tmdb->searchTvSeries($input);
                            $results = $searchRes['results'] ?? [];
                            if (empty($results)) {
                                throw new \RuntimeException("No TV series found matching '{$input}'.");
                            }
                            $tmdbId = (int) $results[0]['id'];
                        }

                        $series = $tmdb->importSeriesWithSeasons($tmdbId);
                        $series->load('seasons.episodes');

                        $seasonsCount = $series->seasons->count();
                        $episodesCount = $series->seasons->sum(fn ($s) => $s->episodes->count());

                        Notification::make()
                            ->title('Web Series Imported Successfully')
                            ->body("Imported '{$series->title}' with {$seasonsCount} Seasons and {$episodesCount} total Episodes!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Series Import Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // 2. Quick Add Bangla Natok Drama Serial
            Action::make('addNatokSerial')
                ->label('+ Add Natok Serial')
                ->icon('heroicon-m-sparkles')
                ->color('warning')
                ->modalHeading('Quick Add Bangla Natok Serial / Drama Series')
                ->modalDescription('Add episodic Bengali drama serials (e.g. Bachelor Point, Family Crisis). Automatically initializes seasons and episode slots.')
                ->form([
                    TextInput::make('title')
                        ->label('Serial Title (বাংলা / English)')
                        ->required()
                        ->placeholder('e.g. ব্যাচেলর পয়েন্ট | Bachelor Point')
                        ->helperText('Title of the drama serial.'),
                    Select::make('ott_platform')
                        ->label('Platform / YouTube Channel')
                        ->options([
                            'youtube' => 'YouTube Drama',
                            'chorki' => 'Chorki (চরকি)',
                            'bongo' => 'Bongo BD (বঙ্গ)',
                            'toffee' => 'Toffee (টফি)',
                            'cinemawala' => 'Cinemawala (সিনেমাওয়ালা)',
                            'deeptoplay' => 'DeeptoPlay',
                            'hoichoi' => 'Hoichoi',
                            'bioscope' => 'Bioscope',
                        ])
                        ->default('youtube')
                        ->required(),
                    TextInput::make('poster_url')
                        ->label('Poster Image URL')
                        ->placeholder('https://.../poster.jpg')
                        ->helperText('High resolution vertical poster image.'),
                    TextInput::make('backdrop_url')
                        ->label('Backdrop Banner URL')
                        ->placeholder('https://.../backdrop.jpg'),
                    TextInput::make('trailer_url')
                        ->label('YouTube Trailer / Promo URL')
                        ->placeholder('https://www.youtube.com/watch?v=...'),
                    TextInput::make('initial_seasons')
                        ->label('Number of Seasons')
                        ->numeric()
                        ->default(1)
                        ->required(),
                    TextInput::make('episodes_per_season')
                        ->label('Episodes Per Season (Slots)')
                        ->numeric()
                        ->default(10)
                        ->required(),
                    DatePicker::make('first_air_date')
                        ->label('First Air Date')
                        ->default(now()),
                    Textarea::make('overview')
                        ->label('Synopsis / Description')
                        ->placeholder('Brief overview of the drama serial...')
                        ->rows(2),
                    Toggle::make('is_featured')
                        ->label('Featured Series')
                        ->default(true),
                ])
                ->action(function (array $data): void {
                    try {
                        $title = trim($data['title']);
                        $slug = Str::slug($title);
                        if (empty($slug)) {
                            $slug = 'natok-serial-' . time();
                        }
                        if (Series::where('slug', $slug)->exists()) {
                            $slug .= '-' . time();
                        }

                        $series = Series::create([
                            'title' => $title,
                            'slug' => $slug,
                            'overview' => $data['overview'] ?? "Popular episodic Bengali drama serial.",
                            'poster_url' => $data['poster_url'] ?: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80',
                            'backdrop_url' => $data['backdrop_url'] ?: ($data['poster_url'] ?: null),
                            'trailer_url' => $data['trailer_url'] ?? null,
                            'first_air_date' => $data['first_air_date'] ?? now()->toDateString(),
                            'rating' => 8.8,
                            'genres' => ['Bangla Natok', 'Drama Serial', 'Comedy', 'Bengali'],
                            'ott_platform' => $data['ott_platform'] ?? 'youtube',
                            'is_published' => true,
                            'is_featured' => !empty($data['is_featured']),
                        ]);

                        $numSeasons = max(1, (int) ($data['initial_seasons'] ?? 1));
                        $numEpisodes = max(1, (int) ($data['episodes_per_season'] ?? 10));

                        for ($s = 1; $s <= $numSeasons; $s++) {
                            $season = Season::create([
                                'series_id' => $series->id,
                                'season_number' => $s,
                                'title' => "Season {$s}",
                                'poster_url' => $series->poster_url,
                            ]);

                            for ($e = 1; $e <= $numEpisodes; $e++) {
                                Episode::create([
                                    'season_id' => $season->id,
                                    'episode_number' => $e,
                                    'title' => "Episode {$e}",
                                    'overview' => "Episode {$e} of {$series->title}",
                                    'still_url' => $series->backdrop_url ?: $series->poster_url,
                                    'duration_minutes' => 35,
                                ]);
                            }
                        }

                        Notification::make()
                            ->title('Natok Serial Created')
                            ->body("Successfully created '{$series->title}' with {$numSeasons} Seasons and " . ($numSeasons * $numEpisodes) . " Episode slots!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Failed to Create Serial')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            // 3. Batch Sync Trending TV Shows
            Action::make('syncTrendingSeries')
                ->label('Sync Trending Series')
                ->icon('heroicon-m-fire')
                ->color('danger')
                ->modalHeading('Batch Sync Trending Web Series')
                ->modalDescription('Pulls trending TV series from TMDB and auto-generates all seasons and episode lists.')
                ->form([
                    Select::make('count')
                        ->label('Number of Web Series to Sync')
                        ->options([
                            '3' => 'Top 3 Series',
                            '5' => 'Top 5 Series',
                            '8' => 'Top 8 Series',
                        ])
                        ->default('3')
                        ->required(),
                ])
                ->action(function (array $data, TmdbService $tmdb): void {
                    try {
                        $count = (int) $data['count'];
                        $trending = $tmdb->getTrendingTvSeries('week');
                        $items = $trending['results'] ?? [];

                        if (empty($items)) {
                            throw new \RuntimeException("No trending TV series returned from TMDB API.");
                        }

                        $imported = 0;
                        foreach (array_slice($items, 0, $count) as $item) {
                            try {
                                $tmdb->importSeriesWithSeasons($item['id']);
                                $imported++;
                            } catch (\Throwable) {
                                // Skip individual failures
                            }
                        }

                        Notification::make()
                            ->title('Trending Series Synced')
                            ->body("Successfully imported {$imported} complete TV series with all seasons & episodes!")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('Series Sync Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),

            CreateAction::make()->label('+ New Series'),
        ];
    }
}
