<?php

namespace App\Filament\Resources\AdPlacements\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AdPlacementForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Placement Name / Note')
                    ->required()
                    ->placeholder('e.g. Header 728x90 or 1xBet Sponsor'),

                Select::make('slot_key')
                    ->label('Ad Position / Slot Key')
                    ->options([
                        'betting_sponsor_1' => 'Top Ticker / Betting Sponsor 1',
                        'betting_sponsor_2' => 'Top Ticker / Betting Sponsor 2',
                        'player_above' => 'Above Video Player (728x90)',
                        'player_below' => 'Below Video Player (Banner / Native)',
                        'sidebar_banner' => 'Sidebar Banner (300x250)',
                        'countdown_page' => 'Safe Gateway Countdown Page',
                        'popunder_script' => 'Global Popunder / Direct Link Script',
                    ])
                    ->required()
                    ->unique(ignoreRecord: true),

                Select::make('ad_type')
                    ->label('Ad Integration Type')
                    ->options([
                        'banner_image' => 'Custom Banner Image + Affiliate URL (1xBet / Sponsors)',
                        'html_code' => 'Raw HTML / JavaScript Code (Adsterra / PropellerAds / Monetag)',
                        'google_adsense' => 'Google AdSense (Safe Mode / Blog Pages)',
                    ])
                    ->required()
                    ->default('banner_image')
                    ->reactive(),

                TextInput::make('banner_image_url')
                    ->label('Banner Image URL')
                    ->url()
                    ->placeholder('https://domain.com/banner.gif')
                    ->visible(fn ($get) => $get('ad_type') === 'banner_image'),

                TextInput::make('target_url')
                    ->label('Click Destination URL (Affiliate Link)')
                    ->url()
                    ->placeholder('https://1xbet.com/?tag=streamtv')
                    ->visible(fn ($get) => $get('ad_type') === 'banner_image'),

                Textarea::make('code_content')
                    ->label('Raw HTML / Script Tag')
                    ->rows(5)
                    ->placeholder('<script type="text/javascript" src="//..."></script>')
                    ->visible(fn ($get) => in_array($get('ad_type'), ['html_code', 'google_adsense'])),

                TextInput::make('countdown_seconds')
                    ->label('Countdown Wait Duration (Seconds)')
                    ->numeric()
                    ->default(15)
                    ->helperText('Used when visitors access the safe gateway/download page.')
                    ->visible(fn ($get) => $get('slot_key') === 'countdown_page'),

                Select::make('cloaking_mode')
                    ->label('Cloaking / Safe Delivery Mode')
                    ->options([
                        'show_all' => 'Show to All Visitors (Standard)',
                        'humans_only' => 'Humans Only (Hide from Googlebot / Crawlers)',
                        'hide_from_bots' => 'Safe Content for Bots (Safe AdSense Mode)',
                    ])
                    ->default('show_all')
                    ->required(),

                Toggle::make('is_active')
                    ->label('Active / Live')
                    ->default(true),
            ]);
    }
}
