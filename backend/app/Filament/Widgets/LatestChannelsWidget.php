<?php

namespace App\Filament\Widgets;

use App\Models\Channel;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestChannelsWidget extends TableWidget
{
    protected static ?string $heading = 'Recent Live TV Channels';

    protected static ?int $sort = 4;

    protected int|string|array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    public function table(Table $table): Table
    {
        return $table
            ->query(Channel::query()->latest()->limit(5))
            ->paginated(false)
            ->columns([
                ImageColumn::make('logo_url')
                    ->label('')
                    ->circular()
                    ->defaultImageUrl('https://via.placeholder.com/32'),

                TextColumn::make('name')
                    ->label('Channel')
                    ->weight('bold')
                    ->searchable(),

                TextColumn::make('category.name')
                    ->label('Category')
                    ->badge()
                    ->color('primary'),

                TextColumn::make('streams_count')
                    ->counts('streams')
                    ->label('Servers')
                    ->badge()
                    ->color('success'),

                ToggleColumn::make('is_active')
                    ->label('Active'),
            ]);
    }
}
