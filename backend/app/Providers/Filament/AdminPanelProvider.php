<?php

namespace App\Providers\Filament;

use App\Filament\Widgets\AnalyticsTrendChartWidget;
use App\Filament\Widgets\ContentDistributionChartWidget;
use App\Filament\Widgets\LatestChannelsWidget;
use App\Filament\Widgets\LatestMoviesWidget;
use App\Filament\Widgets\QuickActionsWidget;
use App\Filament\Widgets\StatsOverviewWidget;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->brandName('ScreenBoxBD Control')
            ->colors([
                'primary' => Color::Emerald,
                'gray' => Color::Zinc,
            ])
            ->font('Inter')
            ->navigationGroups([
                'Live TV & Streams',
                'Video On Demand',
                'Monetization & Plans',
                'Content & Community',
                'Settings & Access',
            ])
            ->navigationItems([
                NavigationItem::make('View Live Web App')
                    ->url('http://localhost:3000', shouldOpenInNewTab: true)
                    ->icon('heroicon-o-arrow-top-right-on-square')
                    ->group('Settings & Access')
                    ->sort(99),
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->widgets([
                QuickActionsWidget::class,
                StatsOverviewWidget::class,
                AnalyticsTrendChartWidget::class,
                ContentDistributionChartWidget::class,
                LatestChannelsWidget::class,
                LatestMoviesWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
