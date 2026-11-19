<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\Movie;

$samples = Movie::take(5)->get(['id', 'title', 'poster_url', 'backdrop_url']);
foreach ($samples as $m) {
    echo "ID {$m->id}: {$m->title}" . PHP_EOL;
    echo "  Poster: {$m->poster_url}" . PHP_EOL;
    echo "  Backdrop: {$m->backdrop_url}" . PHP_EOL;
}
