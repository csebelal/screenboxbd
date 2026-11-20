<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Channel;
use App\Models\Movie;
use App\Models\Series;
use Filament\Widgets\ChartWidget;

class ContentDistributionChartWidget extends ChartWidget
{
    protected ?string $heading = 'Content & Media Library Distribution';

    protected static ?int $sort = 2;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $channels = Channel::count();
        $movies = Movie::count();
        $series = Series::count();
        $categories = Category::count();
        $blogs = BlogPost::count();

        return [
            'datasets' => [
                [
                    'label' => 'Total Count',
                    'data' => [$channels, $movies, $series, $categories, $blogs],
                    'backgroundColor' => [
                        '#10b981', // emerald for channels
                        '#f59e0b', // amber for movies
                        '#3b82f6', // blue for series
                        '#8b5cf6', // purple for categories
                        '#06b6d4', // cyan for blogs
                    ],
                ],
            ],
            'labels' => ['Live Channels', 'Movies', 'TV Series', 'Categories', 'Blog Posts'],
        ];
    }

    protected function getType(): string
    {
        return 'doughnut';
    }
}
