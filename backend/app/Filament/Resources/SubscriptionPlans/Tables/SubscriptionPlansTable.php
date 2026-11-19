<?php

namespace App\Filament\Resources\SubscriptionPlans\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class SubscriptionPlansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Plan')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('badge')
                    ->badge()
                    ->color('warning'),

                TextColumn::make('monthly_price')
                    ->label('Monthly (৳)')
                    ->money('BDT')
                    ->sortable(),

                TextColumn::make('yearly_price')
                    ->label('Yearly (৳)')
                    ->money('BDT')
                    ->sortable(),

                ToggleColumn::make('highlight')
                    ->label('Featured'),

                ToggleColumn::make('is_active')
                    ->label('Active'),

                TextColumn::make('sort_order')
                    ->numeric()
                    ->sortable(),
            ])
            ->actions([
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
