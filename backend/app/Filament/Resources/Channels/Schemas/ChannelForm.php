<?php

namespace App\Filament\Resources\Channels\Schemas;

use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ChannelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('category_id')
                    ->relationship('category', 'name', fn ($query) => $query->where('type', 'tv'))
                    ->searchable()
                    ->preload()
                    ->required(),

                TextInput::make('name')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                TextInput::make('slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('logo_url')
                    ->label('Logo URL')
                    ->url()
                    ->placeholder('https://example.com/logo.png'),

                TextInput::make('country')
                    ->default('BD')
                    ->maxLength(10),

                TextInput::make('sort_order')
                    ->numeric()
                    ->default(0),

                Toggle::make('is_active')
                    ->default(true),

                Toggle::make('is_featured')
                    ->default(false),

                Repeater::make('streams')
                    ->relationship('streams')
                    ->schema([
                        TextInput::make('server_name')
                            ->required()
                            ->default('Server 1')
                            ->placeholder('Server 1 (BDIX / High Quality)'),

                        TextInput::make('stream_url')
                            ->label('HLS Stream URL (.m3u8)')
                            ->required()
                            ->url()
                            ->columnSpan(2),

                        KeyValue::make('headers')
                            ->label('Custom Stream Headers (Referer, User-Agent)')
                            ->keyLabel('Header Name')
                            ->valueLabel('Header Value')
                            ->columnSpanFull(),

                        TextInput::make('priority')
                            ->numeric()
                            ->default(1),

                        Toggle::make('is_active')
                            ->default(true),
                    ])
                    ->columns(3)
                    ->columnSpanFull()
                    ->collapsible()
                    ->defaultItems(1),
            ]);
    }
}
