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
        Schema::table('movies', function (Blueprint $table) {
            $table->string('imdb_id')->nullable()->index()->after('tmdb_id');
            $table->text('trailer_url')->nullable()->after('backdrop_url');
            $table->jsonb('cast')->nullable()->after('genres');
            $table->jsonb('download_sources')->nullable()->after('views');
        });

        Schema::table('series', function (Blueprint $table) {
            $table->string('imdb_id')->nullable()->index()->after('tmdb_id');
            $table->text('trailer_url')->nullable()->after('backdrop_url');
            $table->jsonb('cast')->nullable()->after('genres');
            $table->jsonb('download_sources')->nullable()->after('views');
        });

        Schema::table('episodes', function (Blueprint $table) {
            $table->jsonb('download_sources')->nullable()->after('duration_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->dropColumn('download_sources');
        });

        Schema::table('series', function (Blueprint $table) {
            $table->dropColumn(['imdb_id', 'trailer_url', 'cast', 'download_sources']);
        });

        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn(['imdb_id', 'trailer_url', 'cast', 'download_sources']);
        });
    }
};
