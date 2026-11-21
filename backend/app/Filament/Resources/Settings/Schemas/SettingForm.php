<?php

namespace App\Filament\Resources\Settings\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SettingForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('key')
                    ->label('Setting Key Identifier')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->disabled(fn (string $operation): bool => $operation === 'edit'),

                TextInput::make('label')
                    ->label('Display Title')
                    ->required(),

                Select::make('group')
                    ->label('Configuration Group')
                    ->options([
                        'general' => 'General & Branding',
                        'streaming' => 'Streaming & Player',
                        'contact' => 'Contact & Social Communities',
                        'monetization' => 'Monetization & Billing',
                        'seo' => 'SEO & Social Metadata',
                        'analytics' => 'Analytics & Tracking (Google Analytics / GTM)',
                    ])
                    ->required()
                    ->default('general'),

                Select::make('type')
                    ->label('Input Data Type')
                    ->options([
                        'text' => 'Single Line Text',
                        'textarea' => 'Multi-line Paragraph',
                        'boolean' => 'Boolean Switch (1 / 0)',
                        'select' => 'Preset Options',
                        'number' => 'Numeric Value',
                    ])
                    ->required()
                    ->default('text'),

                Select::make('value')
                    ->label('Boolean Value (চালু / বন্ধ)')
                    ->options([
                        '1' => '✅ Enabled / Active (সক্রিয় - সাইটে দেখাবে)',
                        '0' => '❌ Disabled / Hidden (নিষ্ক্রিয় - সাইট থেকে লুকানো থাকবে)',
                    ])
                    ->visible(fn ($get) => $get('type') === 'boolean')
                    ->columnSpanFull()
                    ->default('0'),

                Textarea::make('value')
                    ->label('Current Value')
                    ->rows(4)
                    ->columnSpanFull()
                    ->placeholder('Enter value for this setting')
                    ->visible(fn ($get) => $get('type') !== 'boolean'),

                Textarea::make('description')
                    ->label('Admin Hint / Description')
                    ->rows(2)
                    ->columnSpanFull(),

                Toggle::make('is_public')
                    ->label('Expose to Frontend Public REST API (/api/v1/settings)')
                    ->default(true),
            ]);
    }
}
