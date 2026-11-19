<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use App\Models\Episode;
use App\Models\Movie;
use App\Models\WatchHistory;
use Illuminate\Http\Request;

class UserActivityController extends Controller
{
    /**
     * Get user's watch history.
     */
    public function getHistory(Request $request)
    {
        $userId = $request->user()?->id;
        if (!$userId) {
            return response()->json(['data' => []]);
        }

        $histories = WatchHistory::where('user_id', $userId)
            ->orderByDesc('updated_at')
            ->take(20)
            ->get();

        return response()->json([
            'data' => $histories,
        ]);
    }

    /**
     * Update watch progress for "Continue Watching".
     */
    public function storeHistory(Request $request)
    {
        $validated = $request->validate([
            'content_type' => 'required|in:movie,episode,channel',
            'content_id' => 'required|integer',
            'progress_seconds' => 'required|integer|min:0',
            'total_seconds' => 'nullable|integer|min:0',
        ]);

        $userId = $request->user()?->id;
        if (!$userId) {
            // For guests, return success acknowledgement
            return response()->json([
                'success' => true,
                'message' => 'Guest progress acknowledged.',
            ]);
        }

        $history = WatchHistory::updateOrCreate(
            [
                'user_id' => $userId,
                'content_type' => $validated['content_type'],
                'content_id' => $validated['content_id'],
            ],
            [
                'progress_seconds' => $validated['progress_seconds'],
                'total_seconds' => $validated['total_seconds'] ?? 0,
                'updated_at' => now(),
            ]
        );

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    /**
     * Get user's bookmarked items.
     */
    public function getBookmarks(Request $request)
    {
        $userId = $request->user()?->id;
        if (!$userId) {
            return response()->json(['data' => []]);
        }

        $bookmarks = Bookmark::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => $bookmarks,
        ]);
    }

    /**
     * Add an item to bookmarks.
     */
    public function storeBookmark(Request $request)
    {
        $validated = $request->validate([
            'content_type' => 'required|in:movie,series,channel',
            'content_id' => 'required|integer',
        ]);

        $userId = $request->user()?->id;
        if (!$userId) {
            return response()->json(['error' => 'Authentication required to save bookmarks.'], 401);
        }

        $bookmark = Bookmark::firstOrCreate([
            'user_id' => $userId,
            'content_type' => $validated['content_type'],
            'content_id' => $validated['content_id'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $bookmark,
        ], 201);
    }

    /**
     * Remove an item from bookmarks.
     */
    public function destroyBookmark(Request $request, int $id)
    {
        $userId = $request->user()?->id;
        if (!$userId) {
            return response()->json(['error' => 'Authentication required.'], 401);
        }

        Bookmark::where('id', $id)->where('user_id', $userId)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bookmark removed.',
        ]);
    }
}
