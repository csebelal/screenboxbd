<?php

use App\Http\Controllers\Api\AdController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ChannelController;
use App\Http\Controllers\Api\HomeController;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\PlatformDynamicController;
use App\Http\Controllers\Api\SeriesController;
use App\Http\Controllers\Api\StreamProxyController;
use App\Http\Controllers\Api\UserActivityController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| StreamTV REST API Endpoints (/api/v1)
|--------------------------------------------------------------------------
*/

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'online',
        'service' => 'ScreenBoxBD Core API',
        'version' => 'v1',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Silencer for any legacy open browser tabs polling live-users (tells browser to cache for 24 hours and stop sending)
Route::get('/stats/live-users', function () {
    return response('', 204, [
        'Cache-Control' => 'public, max-age=86400, immutable',
    ]);
});

// Monetization & Ads
Route::get('/ads/slots', [AdController::class, 'getSlots'])->name('api.ads.slots');

// CORS HLS & Video Stream Proxy
Route::match(['GET', 'OPTIONS'], '/stream/proxy', [StreamProxyController::class, 'proxy'])->name('api.stream.proxy');
Route::match(['GET', 'OPTIONS'], '/stream/drive/{id}', [StreamProxyController::class, 'drive'])->name('api.stream.drive');

// Aggregated Home Endpoint
Route::get('/home', [HomeController::class, 'index'])->name('api.home');

// Categories
Route::get('/categories', [CategoryController::class, 'index'])->name('api.categories.index');

// Live TV Channels
Route::get('/channels', [ChannelController::class, 'index'])->name('api.channels.index');
Route::get('/channels/{slug}', [ChannelController::class, 'show'])->name('api.channels.show');

// Movies (VOD)
Route::get('/movies', [MovieController::class, 'index'])->name('api.movies.index');
Route::get('/movies/{slug}', [MovieController::class, 'show'])->name('api.movies.show');

// Series & Episodes
Route::get('/series', [SeriesController::class, 'index'])->name('api.series.index');
Route::get('/series/{slug}', [SeriesController::class, 'show'])->name('api.series.show');
Route::get('/episodes/{id}', [SeriesController::class, 'episode'])->name('api.episodes.show');

// User Activity (Watch History & Bookmarks)
Route::get('/user/history', [UserActivityController::class, 'getHistory'])->name('api.user.history.get');
Route::post('/user/history', [UserActivityController::class, 'storeHistory'])->name('api.user.history.store');

Route::get('/user/bookmarks', [UserActivityController::class, 'getBookmarks'])->name('api.user.bookmarks.get');
Route::post('/user/bookmarks', [UserActivityController::class, 'storeBookmark'])->name('api.user.bookmarks.store');
Route::delete('/user/bookmarks/{id}', [UserActivityController::class, 'destroyBookmark'])->name('api.user.bookmarks.destroy');

// Dynamic Platform & CMS Endpoints
Route::get('/settings', [PlatformDynamicController::class, 'settings'])->name('api.platform.settings');
Route::get('/plans', [PlatformDynamicController::class, 'plans'])->name('api.platform.plans');
Route::get('/faqs', [PlatformDynamicController::class, 'faqs'])->name('api.platform.faqs');
Route::get('/blogs', [PlatformDynamicController::class, 'blogs'])->name('api.platform.blogs');
Route::get('/blogs/{slug}', [PlatformDynamicController::class, 'blogDetail'])->name('api.platform.blogs.detail');
