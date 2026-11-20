<?php

namespace App\Filament\Resources\Movies\Schemas;

use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class MovieForm
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
                    ->placeholder('e.g. 550')
                    ->suffixAction(
                        \Filament\Forms\Components\Actions\Action::make('fetchFromTmdb')
                            ->icon('heroicon-m-arrow-down-tray')
                            ->tooltip('Fetch metadata from TMDB')
                            ->action(function ($state, callable $set) {
                                if (!$state) {
                                    return;
                                }
                                $tmdb = app(\App\Services\TmdbService::class);
                                $details = $tmdb->getMovieDetails($state);
                                if (!empty($details['id'])) {
                                    $formatted = $tmdb->formatMovieData($details);
                                    $set('title', $formatted['title']);
                                    $set('slug', $formatted['slug']);
                                    $set('overview', $formatted['overview']);
                                    $set('poster_url', $formatted['poster_url']);
                                    $set('backdrop_url', $formatted['backdrop_url']);
                                    $set('trailer_url', $formatted['trailer_url']);
                                    $set('release_date', $formatted['release_date']);
                                    $set('duration_minutes', $formatted['duration_minutes']);
                                    $set('rating', $formatted['rating']);
                                    $set('genres', $formatted['genres']);
                                    $set('imdb_id', $formatted['imdb_id']);
                                }
                            })
                    ),

                TextInput::make('imdb_id')
                    ->label('IMDb ID')
                    ->placeholder('e.g. tt1375666'),

                TextInput::make('trailer_url')
                    ->label('YouTube Trailer URL')
                    ->url()
                    ->placeholder('https://www.youtube.com/watch?v=...'),

                Select::make('ott_platform')
                    ->label('OTT Platform / Network')
                    ->options([
                        'youtube' => 'YouTube (বাংলা নাটক / সিনেমা)',
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

                DatePicker::make('release_date'),

                TextInput::make('duration_minutes')
                    ->label('Duration (minutes)')
                    ->numeric()
                    ->placeholder('120'),

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
                        'Telefilm',
                        'Drama',
                        'Action',
                        'Comedy',
                        'Thriller',
                        'Romance',
                        'Sci-Fi',
                        'Horror',
                        'Family',
                    ])
                    ->helperText('Click a suggested genre or type and press Enter (e.g. Bangla Natok, Telefilm)')
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
                    ->label('Published')
                    ->default(true),

                Toggle::make('is_featured')
                    ->label('Featured Movie')
                    ->default(false),

                Toggle::make('is_hero_slider')
                    ->label('Show in Home Hero Slider')
                    ->helperText('Feature this movie in the main Home page cinematic billboard carousel')
                    ->default(false),

                TextInput::make('hero_order')
                    ->label('Hero Slide Order #')
                    ->numeric()
                    ->default(0)
                    ->helperText('Slide position: 1 appears first, then 2, 3... (0 = end)'),

                Repeater::make('streams')
                    ->relationship('streams')
                    ->schema([
                        TextInput::make('server_name')
                            ->required()
                            ->default('Primary Server')
                            ->placeholder('e.g. Server 1 / Fast HLS'),

                        Select::make('stream_type')
                            ->options([
                                'hls' => 'HLS Stream (.m3u8 - Native ArtPlayer)',
                                'mp4' => 'Direct MP4 Video (.mp4 - Native ArtPlayer)',
                                'drive' => 'Google Drive (ID or Link - 0% Ads)',
                                'youtube' => 'YouTube Clean Natok / Telefilm (No-Cookie)',
                                'embed' => 'Custom Embed Iframe',
                            ])
                            ->required()
                            ->default('hls'),

                        TextInput::make('quality')
                            ->default('Auto')
                            ->placeholder('1080p, 720p, Auto'),

                        TextInput::make('stream_url')
                            ->label('Stream or Embed URL')
                            ->helperText('Paste direct .m3u8, .mp4, Google Drive link/ID, or YouTube video link')
                            ->required()
                            ->columnSpan(2),

                        TextInput::make('priority')
                            ->numeric()
                            ->default(1),
                    ])
                    ->columns(3)
                    ->columnSpanFull()
                    ->collapsible()
                    ->defaultItems(1),
            ]);
    }
}
