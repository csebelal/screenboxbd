<?php

namespace App\Filament\Widgets;

use App\Models\BlogPost;
use App\Models\Category;
use App\Models\Channel;
use App\Models\ChannelStream;
use App\Models\Movie;
use App\Models\Series;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected ?string $pollingInterval = '15s';

    protected function getStats(): array
    {
        $channelCount = Channel::count();
        $activeChannels = Channel::where('is_active', true)->count();
        $streamCount = ChannelStream::count();
        $movieCount = Movie::count();
        $featuredMovies = Movie::where('is_featured', true)->count();
        $seriesCount = Series::count();
        $categoryCount = Category::count();
        $userCount = User::count();
        $totalViews = Movie::sum('views') + BlogPost::sum('views');

        return [
            Stat::make('Live TV Channels', number_format($channelCount))
                ->description("{$activeChannels} Active / {$streamCount} Stream Servers")
                ->descriptionIcon('heroicon-m-tv')
                ->chart([max(0, $channelCount - 30), max(0, $channelCount - 15), max(0, $channelCount - 5), $channelCount])
                ->color('success'),

            Stat::make('VOD Movies', number_format($movieCount))
                ->description("{$featuredMovies} Featured / 1-Click TMDB Sync")
                ->descriptionIcon('heroicon-m-film')
                ->chart([max(0, $movieCount - 60), max(0, $movieCount - 30), max(0, $movieCount - 10), $movieCount])
                ->color('primary'),

            Stat::make('TV Series & Shows', number_format($seriesCount))
                ->description('Episodes & Multi-Season')
                ->descriptionIcon('heroicon-m-video-camera')
                ->chart([0, 1, 2, $seriesCount])
                ->color('info'),

            Stat::make('Content Categories', number_format($categoryCount))
                ->description('Genres, OTT & Regional')
                ->descriptionIcon('heroicon-m-tag')
                ->color('warning'),

            Stat::make('Total Content Views', number_format($totalViews))
                ->description('Platform Engagement')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->chart([120, 340, 680, 1200, 1850, max(2400, (int) $totalViews)])
                ->color('success'),

            Stat::make('System Users', number_format($userCount))
                ->description('Administrators & Users')
                ->descriptionIcon('heroicon-m-users')
                ->color('gray'),
        ];
    }
}
