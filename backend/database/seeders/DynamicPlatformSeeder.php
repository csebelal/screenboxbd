<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\Setting;
use App\Models\SubscriptionPlan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DynamicPlatformSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Dynamic Settings
        $settings = [
            [
                'key' => 'site_name',
                'value' => 'ScreenBoxBD',
                'group' => 'general',
                'type' => 'text',
                'label' => 'Site Name',
                'description' => 'The brand name displayed in the navbar, emails, and header.',
                'is_public' => true,
            ],
            [
                'key' => 'site_tagline',
                'value' => 'BDIX আল্ট্রা-ফাস্ট লাইভ টিভি ও প্রিমিয়াম মুভি স্ট্রিমিং',
                'group' => 'general',
                'type' => 'text',
                'label' => 'Site Tagline',
                'description' => 'Main marketing tagline displayed in hero and footer.',
                'is_public' => true,
            ],
            [
                'key' => 'announcement_active',
                'value' => '1',
                'group' => 'general',
                'type' => 'boolean',
                'label' => 'Enable Announcement Bar',
                'description' => 'Show or hide the top alert/announcement ribbon.',
                'is_public' => true,
            ],
            [
                'key' => 'announcement_text',
                'value' => '🔥 নতুন আপডেট: BDIX 4K সার্ভার যুক্ত হয়েছে! কোনো প্রকার বাফারিং ছাড়াই সমস্ত খেলা ও মুভি উপভোগ করুন।',
                'group' => 'general',
                'type' => 'text',
                'label' => 'Announcement Banner Text',
                'description' => 'Top announcement ticker message.',
                'is_public' => true,
            ],
            [
                'key' => 'announcement_color',
                'value' => 'emerald',
                'group' => 'general',
                'type' => 'select',
                'label' => 'Announcement Ribbon Color',
                'description' => 'Badge accent color (emerald, amber, cyan, rose, indigo).',
                'is_public' => true,
            ],
            [
                'key' => 'announcement_link',
                'value' => '/subscriptions',
                'group' => 'general',
                'type' => 'text',
                'label' => 'Announcement Destination URL',
                'description' => 'Click destination for the announcement bar.',
                'is_public' => true,
            ],
            [
                'key' => 'support_email',
                'value' => 'support@screenboxbd.com',
                'group' => 'contact',
                'type' => 'text',
                'label' => 'Support Email',
                'description' => 'Customer service inquiry email.',
                'is_public' => true,
            ],
            [
                'key' => 'support_phone',
                'value' => '+880 1700-000000',
                'group' => 'contact',
                'type' => 'text',
                'label' => 'Helpline Phone Number',
                'description' => 'Helpline contact for phone inquiries.',
                'is_public' => true,
            ],
            [
                'key' => 'support_telegram',
                'value' => 'https://t.me/screenboxbd',
                'group' => 'contact',
                'type' => 'text',
                'label' => 'Telegram Community URL',
                'description' => 'Official Telegram broadcast / support group link.',
                'is_public' => true,
            ],
            [
                'key' => 'support_whatsapp',
                'value' => 'https://wa.me/8801700000000',
                'group' => 'contact',
                'type' => 'text',
                'label' => 'WhatsApp Support Link',
                'description' => 'Direct WhatsApp chat link.',
                'is_public' => true,
            ],
            [
                'key' => 'support_facebook',
                'value' => 'https://facebook.com/screenboxbd',
                'group' => 'contact',
                'type' => 'text',
                'label' => 'Facebook Page URL',
                'description' => 'Official Facebook community page.',
                'is_public' => true,
            ],
            [
                'key' => 'tmdb_api_key',
                'value' => '4f298a53e5522830c95f789f0e0ec49b',
                'group' => 'streaming',
                'type' => 'text',
                'label' => 'TMDB API v3 Key',
                'description' => 'Used to auto-import movie metadata, covers and ratings.',
                'is_public' => false,
            ],
            [
                'key' => 'player_autoplay',
                'value' => '1',
                'group' => 'streaming',
                'type' => 'boolean',
                'label' => 'Default Autoplay Enabled',
                'description' => 'Whether players should attempt to autoplay video streams.',
                'is_public' => true,
            ],
            [
                'key' => 'player_default_quality',
                'value' => '1080p',
                'group' => 'streaming',
                'type' => 'text',
                'label' => 'Default Video Quality',
                'description' => 'Target stream quality (Auto, 1080p, 720p).',
                'is_public' => true,
            ],
            [
                'key' => 'meta_title',
                'value' => 'ScreenBoxBD - লাইভ টিভি, মুভি ও ওয়েব সিরিজ BDIX স্ট্রিমিং',
                'group' => 'seo',
                'type' => 'text',
                'label' => 'SEO Meta Title',
                'description' => 'Default title tag for search engines.',
                'is_public' => true,
            ],
            [
                'key' => 'meta_description',
                'value' => 'বাংলাদেশের ১ নম্বর বাফারলেস BDIX স্ট্রিমিং প্ল্যাটফর্ম। ২০০+ লাইভ টিভি চ্যানেল ও ১০০০+ HD মুভি দ্রুত ও ফ্রিতে দেখুন।',
                'group' => 'seo',
                'type' => 'textarea',
                'label' => 'SEO Meta Description',
                'description' => 'Default snippet shown on Google / social shares.',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $item) {
            Setting::updateOrCreate(['key' => $item['key']], $item);
        }

        // 2. Seed Dynamic Subscription Plans
        $plans = [
            [
                'name' => 'বেসিক HD (Basic HD)',
                'slug' => 'basic-hd',
                'badge' => 'জনপ্রিয়',
                'monthly_price' => 149,
                'half_yearly_price' => 799,
                'yearly_price' => 1499,
                'currency' => 'BDT',
                'features' => [
                    '১টি স্ক্রিনে একসাথে দেখা যাবে',
                    '৭২০p HD বাফারলেস ভিডিও কোয়ালিটি',
                    'সকল লাইভ টিভি চ্যানেল অ্যাক্সেস',
                    '৫০+ স্পোর্টস ও ক্রিকেট চ্যানেল',
                    'BDIX সুপারফাস্ট ব্যান্ডউইথ',
                    'স্ট্যান্ডার্ড কাস্টমার সাপোর্ট',
                ],
                'highlight' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => 'স্ট্যান্ডার্ড ১০৮০p (Standard Full HD)',
                'slug' => 'standard-1080p',
                'badge' => 'সেরা ভ্যালু / রিকমেন্ডেড',
                'monthly_price' => 299,
                'half_yearly_price' => 1599,
                'yearly_price' => 2999,
                'currency' => 'BDT',
                'features' => [
                    '২টি ডিভাইসে একসাথে দেখা যাবে',
                    '১০৮০p Full HD ক্রিস্টাল ক্লিয়ার কোয়ালিটি',
                    'সকল লাইভ টিভি ও নতুন মুভি/সিরিজ',
                    'জিরো ইন্টারাপশন বাফার-ফ্রি স্ট্রিমিং',
                    'স্মার্ট টিভি, অ্যান্ড্রয়েড ও পিসি সাপোর্ট',
                    '২৪/৭ প্রায়োরিটি হোয়াটসঅ্যাপ সাপোর্ট',
                ],
                'highlight' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => 'প্রিমিয়াম ৪কে ভিআইপি (Premium 4K VIP)',
                'slug' => 'premium-4k-vip',
                'badge' => 'আলটিমেট ভিআইপি',
                'monthly_price' => 499,
                'half_yearly_price' => 2699,
                'yearly_price' => 4999,
                'currency' => 'BDT',
                'features' => [
                    '৪টি ডিভাইসে একসাথে আল্ট্রা স্ট্রিমিং',
                    '4K Ultra HD + ডলবি অ্যাটমস অডিও',
                    'সম্পূর্ণ বিজ্ঞাপনমুক্ত (100% Ad-Free VIP)',
                    'ডেডিকেটেড প্রাইভেট হাই-স্পিড সিডিএন',
                    'স্মার্ট টিভি অ্যাপ এবং অফলাইন ডাউনলোড',
                    'ডেডিকেটেড VIP সাপোর্ট ম্যানেজার',
                ],
                'highlight' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            SubscriptionPlan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }

        // 3. Seed Dynamic FAQs
        $faqs = [
            [
                'question' => 'BDIX কানেকশন কী এবং এটি দিয়ে কীভাবে বাফারলেস দেখা যায়?',
                'answer' => 'BDIX (Bangladesh Internet Exchange) হলো স্থানীয় ইন্টারনেট রুটিং সিস্টেম। আমাদের সার্ভারগুলো বাংলাদেশের শীর্ষস্থানীয় লোকাল ডেটাসেন্টারের সাথে অপটিক্যাল ফাইবার দ্বারা সরাসরি কানেক্টেড। ফলে আন্তর্জাতিক ব্যান্ডউইথ ডাউন থাকলেও আপনি ফুল স্পিডে বাফারলেস স্ট্রিমিং উপভোগ করতে পারেন।',
                'category' => 'streaming',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'question' => 'লাইভ টিভি বা খেলা দেখার জন্য কোনো ফি দিতে হবে?',
                'answer' => 'না! ScreenBoxBD-এর সাধারণ লাইভ টিভি চ্যানেল ও পাবলিক ব্রডকাস্টসমূহ সম্পূর্ণ বিনামূল্যে দেখা যায়। আপনি যদি প্রিমিয়াম 4K আল্ট্রা কোয়ালিটি, সম্পূর্ণ বিজ্ঞাপনমুক্ত অভিজ্ঞতা এবং এক্সক্লুসিভ মুভি কালেকশন চান, তবে ভিআইপি সাবস্ক্রিপশন নিতে পারেন।',
                'category' => 'subscription',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'question' => 'কী কী পেমেন্ট মেথড সাপোর্ট করে?',
                'answer' => 'আমরা বাংলাদেশের সমস্ত শীর্ষস্থানীয় মোবাইল ওয়ালেট যেমন বিকাশ (bKash), নগদ (Nagad), রকেট (Rocket), উপায় (Upay) এবং ভিসা/মাস্টারকার্ড ও ইন্টারনেট ব্যাংকিং সাপোর্ট করি। পেমেন্ট সম্পূর্ণ স্বয়ংক্রিয় ও নিরাপদ।',
                'category' => 'billing',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'question' => 'কোনো চ্যানেল বা মুভি না চললে আমি কী করতে পারি?',
                'answer' => 'প্রতিটি চ্যানেল ও মুভিতে আমাদের একাধিক ব্যাকআপ সার্ভার (Server 1, Server 2, Server 3) যুক্ত রয়েছে। যদি ১ নম্বর সার্ভারে সমস্যা হয়, প্লেয়ারের নিচ থেকে খুব সহজেই সার্ভার সুইচ করে দেখতে পারেন। অথবা আমাদের লাইভ সাপোর্ট গ্রুপে মেসেজ করতে পারেন।',
                'category' => 'streaming',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'question' => 'স্মার্ট টিভি অথবা অ্যান্ড্রয়েড টিভি বক্সে কীভাবে চালাব?',
                'answer' => 'আপনার স্মার্ট টিভির যেকোনো আধুনিক ওয়েব ব্রাউজার (যেমন Chrome, Firefox, Silk) থেকে সরাসরি আমাদের ওয়েবসাইট ভিজিট করে ফুলস্ক্রিনে বাফারলেস উপভোগ করতে পারবেন।',
                'category' => 'general',
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($faqs as $faq) {
            Faq::updateOrCreate(['question' => $faq['question']], $faq);
        }

        // 4. Seed Dynamic Blog Posts
        $blogs = [
            [
                'title' => '২০২৬ সালের সেরা BDIX লাইভ টিভি ও স্ট্রিমিং গাইড: বাফারলেস দেখার উপায়',
                'slug' => 'bdix-live-tv-streaming-guide-2026',
                'summary' => 'কীভাবে বাংলাদেশে কোনো বাফারিং ছাড়া যেকোনো লাইভ টিভি ও ক্রিকেট ম্যাচ ফুল এইচডি কোয়ালিটিতে উপভোগ করবেন তার সম্পূর্ণ বিস্তারিত গাইড।',
                'content' => '<p>বাংলাদেশে ইন্টারনেট স্পিড দিন দিন বৃদ্ধি পেলেও আন্তর্জাতিক ট্রাফিকের ক্যাবল ডিসরাপশন অথবা স্পিড ড্রপের কারণে প্রায়ই লাইভ টিভি ও লাইভ ক্রিকেট স্ট্রিমিংয়ে বাফারিং দেখা দেয়। এই সমস্যার প্রধান সমাধান হলো <strong>BDIX (Bangladesh Internet Exchange)</strong> স্ট্রিমিং।</p><h3>BDIX কী এবং কীভাবে কাজ করে?</h3><p>BDIX হলো বাংলাদেশের স্থানীয় আইএসপিগুলোর মধ্যে একটি ইন্টারকানেকশন প্ল্যাটফর্ম। যখন আপনি এমন কোনো সার্ভার থেকে ভিডিও স্ট্রিম করেন যা বিডিআইএক্স-এর সাথে সংযুক্ত, তখন আপনার ডেটা সিঙ্গাপুর বা ইউরোপ ঘুরে আসে না। সরাসরি লোকাল রুটিংয়ে সেকেন্ডে গিগাবিট স্পিডে লোড হয়।</p><h3>বাফারলেস দেখার শীর্ষ ৩টি টিপস:</h3><ul><li><strong>সঠিক সার্ভার নির্বাচন:</strong> স্ক্রিনবক্সবিডিতে প্রতিটি চ্যানেলের পাশে Server 1 (BDIX Dedicated) দেওয়া থাকে। সেটি সিলেক্ট করুন।</li><li><strong>HLS অ্যাডাপ্টিভ বিটরেট:</strong> প্লেয়ার সেটিংসে কোয়ালিটি Auto রাখলে ইন্টারনেটের গতির সাথে ম্যাচ করে বিটরেট সমন্বিত হয়।</li><li><strong>ব্রাউজার হার্ডওয়্যার অ্যাকসিলারেশন:</strong> আপনার ক্রোম ব্রাউজারে হার্ডওয়্যার অ্যাকসিলারেশন অন রাখলে ফ্রেম ড্রপ হয় না।</li></ul>',
                'banner_url' => 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=1200&auto=format&fit=crop',
                'category' => 'Tech & Guides',
                'author_name' => 'ScreenBoxBD Tech Team',
                'reading_time' => '5 min read',
                'tags' => ['BDIX', 'Live TV', 'Streaming', 'Guide'],
                'views' => 1420,
                'is_published' => true,
                'published_at' => now(),
            ],
            [
                'title' => 'স্মার্ট টিভিতে লাইভ স্পোর্টস ও ক্রিকেট দেখার সেরা উপায়',
                'slug' => 'how-to-watch-live-cricket-on-smart-tv',
                'summary' => 'অ্যান্ড্রয়েড টিভি, স্যামসাং টাইজেন ও এলজি ওয়েবওএস-এ কীভাবে লাইভ খেলাধুলো বাফার ছাড়া ফ্রিতে দেখতে পারবেন।',
                'content' => '<p>বিশ্বকাপ, আইপিএল কিংবা বাংলাদেশ প্রিমিয়ার লিগ (BPL)—বড় পর্দায় লাইভ ম্যাচ দেখার উত্তেজনা অন্যরকম। কিন্তু অনেক সময় টিভিতে কেবল কেবল লাইনে সমস্যা দেখা দেয়। স্মার্ট টিভি ব্রাউজার দিয়ে কীভাবে সর্বোচ্চ রেজ্যুলেশনে ম্যাচ দেখবেন জেনে নিন।</p><h3>টিভি ব্রাউজার সেটআপ:</h3><p>আপনার টিভিতে গুগল প্লে স্টোর থেকে Chrome বা JioPages ব্রাউজার ইনস্টল করুন। এরপর সরাসরি আমাদের ওয়েবসাইটে প্রবেশ করুন। প্লেয়ারের ফুলস্ক্রিন বাটনে ক্লিক করলে রিমোটের মাধ্যমে প্লে/পজ ও চ্যানেল চেঞ্জ করা যাবে।</p>',
                'banner_url' => 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1200&auto=format&fit=crop',
                'category' => 'Sports & OTT',
                'author_name' => 'Sports Desk',
                'reading_time' => '4 min read',
                'tags' => ['Cricket', 'Smart TV', 'Live Sports'],
                'views' => 2840,
                'is_published' => true,
                'published_at' => now(),
            ],
        ];

        foreach ($blogs as $blog) {
            BlogPost::updateOrCreate(['slug' => $blog['slug']], $blog);
        }
    }
}
