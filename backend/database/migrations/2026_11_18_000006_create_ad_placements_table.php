<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_placements', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slot_key')->unique(); // header_top, player_above, player_below, sidebar_banner, popunder_script, countdown_page, betting_sponsor_1, betting_sponsor_2
            $table->string('ad_type')->default('banner_image'); // banner_image, html_code, google_adsense
            $table->text('code_content')->nullable(); // HTML/JS code (Adsterra, PropellerAds, Adsense)
            $table->text('banner_image_url')->nullable(); // Banner image URL
            $table->text('target_url')->nullable(); // Click destination URL (for sponsors/betting links)
            $table->boolean('is_active')->default(true);
            $table->integer('countdown_seconds')->default(15); // Used for countdown_page slot
            $table->string('cloaking_mode')->default('show_all'); // show_all, hide_from_bots, humans_only
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_placements');
    }
};
