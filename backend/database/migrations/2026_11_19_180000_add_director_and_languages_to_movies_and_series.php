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
            $table->string('director')->nullable()->after('cast');
            $table->text('director_avatar')->nullable()->after('director');
            $table->jsonb('languages')->nullable()->after('director_avatar');
        });

        Schema::table('series', function (Blueprint $table) {
            $table->string('director')->nullable()->after('cast');
            $table->text('director_avatar')->nullable()->after('director');
            $table->jsonb('languages')->nullable()->after('director_avatar');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('series', function (Blueprint $table) {
            $table->dropColumn(['director', 'director_avatar', 'languages']);
        });

        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn(['director', 'director_avatar', 'languages']);
        });
    }
};
