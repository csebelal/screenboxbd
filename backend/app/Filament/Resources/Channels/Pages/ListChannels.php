<?php

namespace App\Filament\Resources\Channels\Pages;

use App\Filament\Resources\Channels\ChannelResource;
use App\Services\M3uParserService;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Facades\Storage;

class ListChannels extends ListRecords
{
    protected static string $resource = ChannelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('importM3u')
                ->label('Import M3U Playlist')
                ->icon(Heroicon::OutlinedArrowDownTray)
                ->color('success')
                ->form([
                    TextInput::make('source_url')
                        ->label('Playlist URL or Server File Path')
                        ->placeholder('https://example.com/playlist.m3u or F:\Project\TV\m3u file\1 (1).m3u')
                        ->helperText('Provide a remote IPTV URL or absolute file path, or upload a file below.'),

                    FileUpload::make('m3u_file')
                        ->label('Or Upload .m3u / .m3u8 File')
                        ->acceptedFileTypes(['text/plain', 'application/x-mpegurl', 'audio/x-mpegurl', 'application/vnd.apple.mpegurl'])
                        ->disk('local')
                        ->directory('m3u_imports'),

                    TextInput::make('default_category')
                        ->label('Default Category')
                        ->default('General'),

                    TextInput::make('limit')
                        ->label('Import Limit (Optional)')
                        ->numeric()
                        ->placeholder('Leave empty for all'),
                ])
                ->action(function (array $data, M3uParserService $parser): void {
                    $source = null;

                    if (!empty($data['source_url'])) {
                        $source = trim($data['source_url']);
                    } elseif (!empty($data['m3u_file'])) {
                        $source = Storage::disk('local')->path($data['m3u_file']);
                    }

                    if (!$source) {
                        Notification::make()
                            ->title('Missing source')
                            ->body('Please provide either an M3U URL / file path or upload an M3U file.')
                            ->warning()
                            ->send();
                        return;
                    }

                    try {
                        $results = $parser->import($source, [
                            'default_category' => $data['default_category'] ?? 'General',
                            'limit' => !empty($data['limit']) ? (int) $data['limit'] : null,
                        ]);

                        Notification::make()
                            ->title('M3U Playlist Processed')
                            ->body("Parsed: {$results['total_parsed']} | Channels: {$results['channels_created']} | Streams: {$results['streams_created']}")
                            ->success()
                            ->send();
                    } catch (\Throwable $e) {
                        Notification::make()
                            ->title('M3U Import Failed')
                            ->body($e->getMessage())
                            ->danger()
                            ->send();
                    }
                }),
            CreateAction::make(),
        ];
    }
}
