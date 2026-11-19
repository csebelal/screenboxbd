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
        Schema::create('movies', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tmdb_id')->nullable()->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('overview')->nullable();
            $table->text('poster_url')->nullable();
            $table->text('backdrop_url')->nullable();
            $table->date('release_date')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->jsonb('genres')->nullable(); // e.g. ["Action", "Thriller"]
            $table->boolean('is_published')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
        });

        Schema::create('movie_streams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('movie_id')->constrained('movies')->cascadeOnDelete();
            $table->string('server_name')->default('Primary Server');
            $table->enum('stream_type', ['hls', 'embed', 'mp4'])->default('hls');
            $table->text('stream_url');
            $table->string('quality', 20)->default('Auto'); // 1080p, 720p, 480p, Auto
            $table->integer('priority')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('movie_streams');
        Schema::dropIfExists('movies');
    }
};
