<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('movie_streams', function (Blueprint $table) {
            $table->index('movie_id');
            $table->index(['movie_id', 'priority']);
        });

        Schema::table('channel_streams', function (Blueprint $table) {
            $table->index('channel_id');
            $table->index(['channel_id', 'is_active', 'priority']);
        });

        Schema::table('movies', function (Blueprint $table) {
            $table->index('views');
            $table->index('rating');
            $table->index('release_date');
        });

        Schema::table('channels', function (Blueprint $table) {
            $table->index('category_id');
            $table->index('sort_order');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movie_streams', function (Blueprint $table) {
            $table->dropIndex(['movie_id']);
            $table->dropIndex(['movie_id', 'priority']);
        });

        Schema::table('channel_streams', function (Blueprint $table) {
            $table->dropIndex(['channel_id']);
            $table->dropIndex(['channel_id', 'is_active', 'priority']);
        });

        Schema::table('movies', function (Blueprint $table) {
            $table->dropIndex(['views']);
            $table->dropIndex(['rating']);
            $table->dropIndex(['release_date']);
        });

        Schema::table('channels', function (Blueprint $table) {
            $table->dropIndex(['category_id']);
            $table->dropIndex(['sort_order']);
        });
    }
};
