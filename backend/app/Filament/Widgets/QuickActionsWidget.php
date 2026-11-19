<?php

namespace App\Filament\Widgets;

use Filament\Widgets\Widget;

class QuickActionsWidget extends Widget
{
    protected static ?int $sort = 0;

    protected string $view = 'filament.widgets.quick-actions';

    protected int|string|array $columnSpan = 'full';
}
