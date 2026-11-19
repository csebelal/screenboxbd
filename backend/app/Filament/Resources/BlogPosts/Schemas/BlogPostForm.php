<?php

namespace App\Filament\Resources\BlogPosts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class BlogPostForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label('Article Title')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn ($state, callable $set) => $set('slug', Str::slug($state)))
                    ->columnSpanFull(),

                TextInput::make('slug')
                    ->label('Slug')
                    ->required()
                    ->unique(ignoreRecord: true),

                Select::make('category')
                    ->label('Category')
                    ->options([
                        'Tech & Guides' => 'Tech & Guides',
                        'Sports & OTT' => 'Sports & OTT',
                        'Entertainment' => 'Entertainment',
                        'News & Updates' => 'News & Updates',
                    ])
                    ->default('Tech & Guides')
                    ->required(),

                TextInput::make('banner_url')
                    ->label('Banner Cover Image URL')
                    ->url()
                    ->placeholder('https://images.unsplash.com/...')
                    ->columnSpanFull(),

                TextInput::make('author_name')
                    ->label('Author Name')
                    ->default('ScreenBoxBD Editorial')
                    ->required(),

                TextInput::make('reading_time')
                    ->label('Estimated Read Time')
                    ->default('5 min read'),

                TagsInput::make('tags')
                    ->label('Tags')
                    ->placeholder('Add tag and press Enter'),

                DateTimePicker::make('published_at')
                    ->label('Publish Date & Time')
                    ->default(now()),

                Textarea::make('summary')
                    ->label('Excerpt / Summary')
                    ->rows(3)
                    ->columnSpanFull(),

                Textarea::make('content')
                    ->label('Article Content (HTML / Markdown supported)')
                    ->rows(12)
                    ->required()
                    ->columnSpanFull(),

                Toggle::make('is_published')
                    ->label('Published & Visible on Website')
                    ->default(true),
            ]);
    }
}
