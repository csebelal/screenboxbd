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
                        'analytics' => 'amber',
                        default => 'gray',
                    })
                    ->sortable(),

                TextColumn::make('value')
                    ->label('Current Value')
                    ->formatStateUsing(function ($state, $record) {
                        if ($record->type === 'boolean') {
                            return filter_var($state, FILTER_VALIDATE_BOOLEAN)
                                ? '✅ Enabled / Active'
                                : '❌ Disabled / Hidden';
                        }
                        return $state;
                    })
                    ->badge(fn ($record) => $record->type === 'boolean')
                    ->color(fn ($record) => $record->type === 'boolean'
                        ? (filter_var($record->value, FILTER_VALIDATE_BOOLEAN) ? 'success' : 'danger')
                        : 'gray'
                    )
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
                        'analytics' => 'Analytics & Tracking (Google Analytics / GTM)',
                    ]),
            ])
            ->actions([
                \Filament\Actions\Action::make('toggle_boolean')
                    ->label(fn ($record) => filter_var($record->value, FILTER_VALIDATE_BOOLEAN) ? 'Turn OFF (হাইড করুন)' : 'Turn ON (শো করুন)')
                    ->icon(fn ($record) => filter_var($record->value, FILTER_VALIDATE_BOOLEAN) ? 'heroicon-o-eye-slash' : 'heroicon-o-eye')
                    ->color(fn ($record) => filter_var($record->value, FILTER_VALIDATE_BOOLEAN) ? 'danger' : 'success')
                    ->visible(fn ($record) => $record->type === 'boolean')
                    ->action(function ($record) {
                        $current = filter_var($record->value, FILTER_VALIDATE_BOOLEAN);
                        $record->update(['value' => $current ? '0' : '1']);
                        \Illuminate\Support\Facades\Cache::forget('app_public_settings');
                        \Illuminate\Support\Facades\Cache::forget('api_home_payload');
                        \Filament\Notifications\Notification::make()
                            ->title($record->label . ($current ? ' Disabled (এখন সাইট থেকে লুকানো)' : ' Enabled (এখন সাইটে দৃশ্যমান)'))
                            ->success()
                            ->send();
                    }),
                EditAction::make(),
            ])
            ->bulkActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
