<?php

namespace App\Filament\Resources\Series\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SeriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('poster_url')
                    ->label('Poster')
                    ->square()
                    ->defaultImageUrl('https://via.placeholder.com/60x90'),

                TextColumn::make('title')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('ott_platform')
                    ->label('OTT')
                    ->badge()
                    ->colors([
                        'warning' => 'chorki',
                        'danger' => 'hoichoi',
                        'success' => 'toffee',
                        'info' => 'bongo',
                        'primary' => fn ($state): bool => in_array($state, ['bioscope', 'binge', 'netflix', 'prime']),
                    ])
                    ->formatStateUsing(fn ($state) => $state ? strtoupper($state) : '-')
                    ->sortable(),

                TextColumn::make('seasons_count')
                    ->counts('seasons')
                    ->label('Seasons')
                    ->badge()
                    ->color('primary'),

                TextColumn::make('rating')
                    ->badge()
                    ->color('warning')
                    ->sortable(),

                TextColumn::make('genres')
                    ->badge()
                    ->separator(','),

                TextColumn::make('first_air_date')
                    ->date('Y')
                    ->label('Year')
                    ->sortable(),

                ToggleColumn::make('is_published')
                    ->label('Published'),
            ])
            ->filters([
                SelectFilter::make('ott_platform')
                    ->label('OTT Platform')
                    ->options([
                        'chorki' => 'Chorki (চরকি)',
                        'hoichoi' => 'Hoichoi (হইচই)',
                        'toffee' => 'Toffee (টফি)',
                        'bongo' => 'Bongo BD (বঙ্গ)',
                        'bioscope' => 'Bioscope (বায়োস্কোপ)',
                        'binge' => 'Binge (বিঞ্জ)',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
