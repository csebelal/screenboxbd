<?php

namespace App\Filament\Resources\Settings\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class SettingsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('label')
                    ->label('Setting')
                    ->weight('bold')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('key')
                    ->label('Identifier')
                    ->fontFamily('mono')
                    ->copyable()
                    ->badge()
                    ->color('gray')
                    ->searchable(),

                TextColumn::make('group')
                    ->label('Group')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'general' => 'primary',
                        'streaming' => 'success',
                        'contact' => 'info',
                        'monetization' => 'warning',
                        'seo' => 'purple',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('value')
                    ->label('Current Value')
                    ->limit(45)
                    ->tooltip(fn ($record) => $record->value),

                ToggleColumn::make('is_public')
                    ->label('API Public'),

                TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('group')
                    ->options([
                        'general' => 'General & Branding',
                        'streaming' => 'Streaming & Player',
                        'contact' => 'Contact & Social Communities',
                        'monetization' => 'Monetization & Billing',
                        'seo' => 'SEO & Social Metadata',
                    ]),
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
