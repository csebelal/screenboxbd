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
            $table->string('ott_platform', 50)->nullable()->index()->after('slug');
        });

        Schema::table('series', function (Blueprint $table) {
            $table->string('ott_platform', 50)->nullable()->index()->after('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('movies', function (Blueprint $table) {
            $table->dropColumn('ott_platform');
        });

        Schema::table('series', function (Blueprint $table) {
            $table->dropColumn('ott_platform');
        });
    }
};
