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
            // Quick Add Bangla Natok / Telefilm (Manual Entry)
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

            CreateAction::make()->label('+ New Movie'),
        ];
    }
}
