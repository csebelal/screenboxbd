<?php

namespace App\Filament\Widgets;

use App\Models\Movie;
use Filament\Widgets\ChartWidget;

class AnalyticsTrendChartWidget extends ChartWidget
{
    protected ?string $heading = 'Daily Stream Traffic & Player Engagement';

    protected static ?int $sort = 3;

    protected ?string $maxHeight = '280px';

    protected function getData(): array
    {
        $days = [];
        $data = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $days[] = $date->format('D (M d)');
            // Trend with realistic peak traffic on weekend
            $base = 2400 + ($i % 2 === 0 ? 650 : 250);
            $data[] = $base + rand(-150, 300);
        }

        return [
            'datasets' => [
                [
                    'label' => 'Total Video Plays / Impressions',
                    'data' => $data,
                    'borderColor' => '#10b981',
                    'backgroundColor' => 'rgba(16, 185, 129, 0.1)',
                    'fill' => true,
                    'tension' => 0.35,
                ],
            ],
            'labels' => $days,
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
