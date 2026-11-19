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
        Schema::create('series', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('tmdb_id')->nullable()->unique();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('overview')->nullable();
            $table->text('poster_url')->nullable();
            $table->text('backdrop_url')->nullable();
            $table->date('first_air_date')->nullable();
            $table->decimal('rating', 3, 1)->default(0.0);
            $table->jsonb('genres')->nullable();
            $table->boolean('is_published')->default(true)->index();
            $table->boolean('is_featured')->default(false)->index();
            $table->unsignedBigInteger('views')->default(0);
            $table->timestamps();
        });

        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->foreignId('series_id')->constrained('series')->cascadeOnDelete();
            $table->integer('season_number')->default(1);
            $table->string('title')->nullable();
            $table->text('poster_url')->nullable();
            $table->timestamps();
        });

        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('season_id')->constrained('seasons')->cascadeOnDelete();
            $table->integer('episode_number')->default(1);
            $table->string('title')->nullable();
            $table->text('overview')->nullable();
            $table->text('still_url')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->timestamps();
        });

        Schema::create('episode_streams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('episode_id')->constrained('episodes')->cascadeOnDelete();
            $table->string('server_name')->default('Server 1');
            $table->enum('stream_type', ['hls', 'embed', 'mp4'])->default('hls');
            $table->text('stream_url');
            $table->string('quality', 20)->default('Auto');
            $table->integer('priority')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('episode_streams');
        Schema::dropIfExists('episodes');
        Schema::dropIfExists('seasons');
        Schema::dropIfExists('series');
    }
};
