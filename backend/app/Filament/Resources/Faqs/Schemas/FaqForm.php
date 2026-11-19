<?php

namespace App\Filament\Resources\Faqs\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class FaqForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('question')
                    ->label('Question (Bangla / English)')
                    ->required()
                    ->columnSpanFull(),

                Select::make('category')
                    ->label('Category Topic')
                    ->options([
                        'general' => 'General / সাধারণ',
                        'streaming' => 'BDIX & Streaming / স্ট্রিমিং ও বাফারিং',
                        'subscription' => 'Subscription & VIP / সাবস্ক্রিপশন',
                        'billing' => 'Payment & Billing / বিকাশ-নগদ পেমেন্ট',
                        'support' => 'Technical Support / সহায়তা',
                    ])
                    ->default('general')
                    ->required(),

                TextInput::make('sort_order')
                    ->label('Display Order')
                    ->numeric()
                    ->default(0),

                Textarea::make('answer')
                    ->label('Detailed Answer')
                    ->rows(5)
                    ->required()
                    ->columnSpanFull(),

                Toggle::make('is_active')
                    ->label('Active / Visible in FAQ Accordion')
                    ->default(true),
            ]);
    }
}
