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
        Schema::create('watch_histories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('content_type', 30); // 'movie', 'episode', 'channel'
            $table->unsignedBigInteger('content_id');
            $table->integer('progress_seconds')->default(0);
            $table->integer('total_seconds')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'content_type', 'content_id']);
        });

        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('content_type', 30); // 'movie', 'series', 'channel'
            $table->unsignedBigInteger('content_id');
            $table->timestamps();

            $table->unique(['user_id', 'content_type', 'content_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
        Schema::dropIfExists('watch_histories');
    }
};
