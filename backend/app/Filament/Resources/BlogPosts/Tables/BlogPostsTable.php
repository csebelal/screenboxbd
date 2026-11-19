<?php

namespace App\Filament\Resources\BlogPosts\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class BlogPostsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('banner_url')
                    ->label('Cover')
                    ->width(60)
                    ->height(40)
                    ->defaultImageUrl('https://via.placeholder.com/60x40'),

                TextColumn::make('title')
                    ->label('Title')
                    ->weight('bold')
                    ->limit(40)
                    ->searchable()
                    ->sortable(),

                TextColumn::make('category')
                    ->badge()
                    ->color('info')
                    ->sortable(),

                TextColumn::make('author_name')
                    ->label('Author')
                    ->toggleable(),

                TextColumn::make('views')
                    ->label('Views')
                    ->numeric()
                    ->sortable(),

                ToggleColumn::make('is_published')
                    ->label('Published'),

                TextColumn::make('published_at')
                    ->label('Date')
                    ->date()
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('category')
                    ->options([
                        'Tech & Guides' => 'Tech & Guides',
                        'Sports & OTT' => 'Sports & OTT',
                        'Entertainment' => 'Entertainment',
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
