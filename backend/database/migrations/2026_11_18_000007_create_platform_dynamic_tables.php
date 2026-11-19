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
        // 1. Dynamic Platform & Site Settings
        if (!Schema::hasTable('settings')) {
            Schema::create('settings', function (Blueprint $table) {
                $table->id();
                $table->string('key')->unique()->index();
                $table->text('value')->nullable();
                $table->string('group', 50)->default('general')->index();
                $table->string('type', 30)->default('text');
                $table->string('label');
                $table->text('description')->nullable();
                $table->boolean('is_public')->default(true)->index();
                $table->timestamps();
            });
        }

        // 2. Dynamic Subscription & Pricing Plans
        if (!Schema::hasTable('subscription_plans')) {
            Schema::create('subscription_plans', function (Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->string('slug')->unique();
                $table->string('badge')->nullable();
                $table->integer('monthly_price')->default(149);
                $table->integer('half_yearly_price')->default(799);
                $table->integer('yearly_price')->default(1499);
                $table->string('currency', 10)->default('BDT');
                $table->jsonb('features')->nullable();
                $table->boolean('highlight')->default(false);
                $table->boolean('is_active')->default(true)->index();
                $table->integer('sort_order')->default(0);
                $table->string('checkout_url')->nullable();
                $table->timestamps();
            });
        }

        // 3. Dynamic FAQs & Support Questions
        if (!Schema::hasTable('faqs')) {
            Schema::create('faqs', function (Blueprint $table) {
                $table->id();
                $table->string('question');
                $table->text('answer');
                $table->string('category', 50)->default('general')->index();
                $table->boolean('is_active')->default(true)->index();
                $table->integer('sort_order')->default(0);
                $table->timestamps();
            });
        }

        // 4. Dynamic Blog & Editorial Posts
        if (!Schema::hasTable('blog_posts')) {
            Schema::create('blog_posts', function (Blueprint $table) {
                $table->id();
                $table->string('title');
                $table->string('slug')->unique()->index();
                $table->text('summary')->nullable();
                $table->longText('content');
                $table->text('banner_url')->nullable();
                $table->string('category', 60)->default('Guides & Tech')->index();
                $table->string('author_name', 100)->default('ScreenBoxBD Editorial');
                $table->string('reading_time', 30)->default('5 min read');
                $table->jsonb('tags')->nullable();
                $table->unsignedBigInteger('views')->default(0);
                $table->boolean('is_published')->default(true)->index();
                $table->timestamp('published_at')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('subscription_plans');
        Schema::dropIfExists('settings');
    }
};
