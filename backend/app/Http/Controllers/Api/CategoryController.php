<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * List categories with channel counts, optionally filtered by type.
     */
    public function index(Request $request)
    {
        $cacheKey = 'categories_index_' . md5($request->fullUrl());

        return \Illuminate\Support\Facades\Cache::remember($cacheKey, 120, function () use ($request) {
            $query = Category::query()->orderBy('sort_order')->orderBy('name');

            if ($request->has('type')) {
                $query->where('type', $request->query('type'));
            }

            $categories = $query->withCount('channels')->get();

            return CategoryResource::collection($categories);
        });
    }
}
