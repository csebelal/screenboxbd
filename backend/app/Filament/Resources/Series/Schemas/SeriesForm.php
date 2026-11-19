<?php

namespace App\Filament\Resources\Series\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SeriesForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('tmdb_id')
                    ->label('TMDB ID')
                    ->numeric()
                    ->placeholder('e.g. 66732')
                    ->suffixAction(
                        \Filament\Forms\Components\Actions\Action::make('fetchFromTmdb')
                            ->icon('heroicon-m-arrow-down-tray')
                            ->tooltip('Fetch metadata & seasons from TMDB')
                            ->action(function ($state, callable $set) {
                                if (!$state) {
                                    return;
                                }
                                $tmdb = app(\App\Services\TmdbService::class);
                                $details = $tmdb->getTvSeriesDetails($state);
                                if (!empty($details['id'])) {
                                    $formatted = $tmdb->formatSeriesData($details);
                                    $set('title', $formatted['title']);
                                    $set('slug', $formatted['slug']);
                                    $set('overview', $formatted['overview']);
                                    $set('poster_url', $formatted['poster_url']);
                                    $set('backdrop_url', $formatted['backdrop_url']);
                                    $set('trailer_url', $formatted['trailer_url']);
                                    $set('first_air_date', $formatted['first_air_date']);
                                    $set('rating', $formatted['rating']);
                                    $set('genres', $formatted['genres']);
                                    $set('imdb_id', $formatted['imdb_id']);
                                }
                            })
                    ),

                TextInput::make('imdb_id')
                    ->label('IMDb ID')
                    ->placeholder('e.g. tt4574334'),

                TextInput::make('trailer_url')
                    ->label('YouTube Trailer URL')
                    ->url()
                    ->placeholder('https://www.youtube.com/watch?v=...'),

                Select::make('ott_platform')
                    ->label('OTT Platform / Network')
                    ->options([
                        'youtube' => 'YouTube (বাংলা নাটক / ওয়েব সিরিজ)',
                        'cinemawala' => 'Cinemawala (সিনেমাওয়ালা)',
                        'chorki' => 'Chorki (চরকি)',
                        'hoichoi' => 'Hoichoi (হইচই)',
                        'toffee' => 'Toffee (টফি)',
                        'bongo' => 'Bongo BD (বঙ্গ)',
                        'cmv' => 'CMV Drama',
                        'deeptoplay' => 'DeeptoPlay',
                        'bioscope' => 'Bioscope (বায়োস্কোপ)',
                        'binge' => 'Binge (বিঞ্জ)',
                        'netflix' => 'Netflix',
                        'prime' => 'Amazon Prime Video',
                    ])
                    ->searchable()
                    ->placeholder('Select Platform if Original')
                    ->nullable(),

                DatePicker::make('first_air_date'),

                TextInput::make('rating')
                    ->numeric()
                    ->default(0.0)
                    ->minValue(0)
                    ->maxValue(10)
                    ->step(0.1),

                TagsInput::make('genres')
                    ->label('Genres (JSONB)')
                    ->placeholder('Add genre and press enter')
                    ->suggestions([
                        'Bangla Natok',
                        'Drama Serial',
                        'Web Series',
                        'Comedy',
                        'Thriller',
                        'Romance',
                        'Crime',
                        'Action',
                        'Family',
                    ])
                    ->helperText('Click a suggested genre or type and press Enter (e.g. Bangla Natok, Drama Serial)')
                    ->columnSpanFull(),

                TextInput::make('poster_url')
                    ->label('Poster Image URL')
                    ->url()
                    ->placeholder('https://image.tmdb.org/t/p/w500/...'),

                TextInput::make('backdrop_url')
                    ->label('Backdrop Image URL')
                    ->url()
                    ->placeholder('https://image.tmdb.org/t/p/original/...'),

                Textarea::make('overview')
                    ->rows(3)
                    ->columnSpanFull(),

                Toggle::make('is_published')
                    ->default(true),

                Toggle::make('is_featured')
                    ->default(false),
            ]);
    }
}
