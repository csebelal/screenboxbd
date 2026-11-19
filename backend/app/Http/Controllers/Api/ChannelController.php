<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use Illuminate\Http\Request;

class ChannelController extends Controller
{
    /**
     * Paginated channels list with flexible filters.
     */
    public function index(Request $request)
    {
        $cacheKey = 'channels_index_' . md5($request->fullUrl());

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Channel::query()
                ->active()
                ->with(['category', 'streams' => fn ($q) => $q->where('is_active', true)->orderBy('priority')]);

            if ($request->filled('category_id')) {
                $query->where('category_id', $request->query('category_id'));
            } elseif ($request->filled('category')) {
                $categorySlug = $request->query('category');
                $query->whereHas('category', fn ($q) => $q->where('slug', $categorySlug));
            }

            if ($request->filled('country')) {
                $query->where('country', strtoupper($request->query('country')));
            }

            if ($request->boolean('featured')) {
                $query->featured();
            }

            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->where('name', 'ILIKE', "%{$search}%");
            }

            $perPage = min((int) $request->query('per_page', 30), 300);
            $channels = $query->orderBy('sort_order')->orderBy('name')->paginate($perPage);

            return ChannelResource::collection($channels);
        });
    }

    /**
     * Single channel details with all active backup streams.
     */
    public function show(string $slug)
    {
        $channel = Channel::where('slug', $slug)
            ->with(['category', 'streams' => fn ($q) => $q->where('is_active', true)->orderBy('priority')])
            ->firstOrFail();

        return new ChannelResource($channel);
    }
}
