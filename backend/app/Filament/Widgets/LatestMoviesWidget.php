<?php

namespace App\Filament\Widgets;

use App\Models\Movie;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget;

class LatestMoviesWidget extends TableWidget
{
    protected static ?string $heading = 'Recent VOD Movies';

    protected static ?int $sort = 5;

    protected int|string|array $columnSpan = [
        'md' => 1,
        'xl' => 1,
    ];

    public function table(Table $table): Table
    {
        return $table
            ->query(Movie::query()->latest()->limit(5))
            ->paginated(false)
            ->columns([
                ImageColumn::make('poster_url')
                    ->label('')
                    ->width(40)
                    ->height(55)
                    ->defaultImageUrl('https://via.placeholder.com/40x55'),

                TextColumn::make('title')
                    ->label('Title')
                    ->weight('bold')
                    ->limit(25)
                    ->searchable(),

                TextColumn::make('rating')
                    ->label('Rating')
                    ->badge()
                    ->color('warning')
                    ->formatStateUsing(fn ($state) => '★ ' . number_format((float) $state, 1)),

                TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable(),

                ToggleColumn::make('is_published')
                    ->label('Published'),
            ]);
    }
}
