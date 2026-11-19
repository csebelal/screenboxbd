<?php

namespace App\Filament\Resources\SubscriptionPlans\Schemas;

use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class SubscriptionPlanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->label('Plan Name (e.g. Standard 1080p)')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state))),

                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                TextInput::make('badge')
                    ->label('Promotional Ribbon Badge')
                    ->placeholder('e.g. জনপ্রিয় or সেরা ভ্যালু'),

                TextInput::make('monthly_price')
                    ->label('Monthly Price (BDT)')
                    ->numeric()
                    ->required()
                    ->default(149),

                TextInput::make('half_yearly_price')
                    ->label('Half-Yearly Price (BDT)')
                    ->numeric()
                    ->default(799),

                TextInput::make('yearly_price')
                    ->label('Yearly Price (BDT)')
                    ->numeric()
                    ->default(1499),

                TextInput::make('currency')
                    ->label('Currency Code')
                    ->default('BDT')
                    ->required(),

                TextInput::make('sort_order')
                    ->label('Sort Display Order')
                    ->numeric()
                    ->default(0),

                TagsInput::make('features')
                    ->label('Features & Benefits List')
                    ->placeholder('Add feature point and press Enter')
                    ->columnSpanFull(),

                Toggle::make('highlight')
                    ->label('Highlight / Recommend on Pricing Page')
                    ->default(false),

                Toggle::make('is_active')
                    ->label('Active / Visible to Public')
                    ->default(true),
            ]);
    }
}
