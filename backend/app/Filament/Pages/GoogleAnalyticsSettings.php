<?php

namespace App\Filament\Pages;

use App\Models\Setting;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\Cache;

class GoogleAnalyticsSettings extends Page implements HasForms
{
    use InteractsWithForms;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-chart-bar';

    protected static string | \UnitEnum | null $navigationGroup = 'Settings & Access';

    protected static ?string $navigationLabel = 'Google Analytics & GTM';

    protected static ?string $title = 'Google Analytics & Google Tag Manager (GTM)';

    protected static ?int $navigationSort = 10;

    protected string $view = 'filament.pages.google-analytics-settings';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill([
            'google_analytics_enabled' => (bool) Setting::get('google_analytics_enabled', true),
            'google_tag_manager_id' => Setting::get('google_tag_manager_id', 'GTM-T4M9PSPK'),
            'google_analytics_id' => Setting::get('google_analytics_id', ''),
            'custom_header_scripts' => Setting::get('custom_header_scripts', ''),
            'custom_footer_scripts' => Setting::get('custom_footer_scripts', ''),
        ]);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make('গুগল ট্যাগ ম্যানেজার ও অ্যানালিটিক্স কনফিগারেশন')
                    ->description('এখানে আপনার Google Tag Manager (GTM) Container ID ও Google Analytics (GA4) আইডি বসিয়ে সহজেই পরিচালনা করুন।')
                    ->schema([
                        Toggle::make('google_analytics_enabled')
                            ->label('Enable Google Analytics & GTM Tracking (ট্র্যাকিং চালু রাখুন)')
                            ->helperText('চালু থাকলে সাইটে ট্র্যাকিং কোড লোড হবে। ট্র্যাকিং বন্ধ করতে চাইলে এটি অফ করুন।')
                            ->default(true),

                        TextInput::make('google_tag_manager_id')
                            ->label('Google Tag Manager (GTM) Container ID')
                            ->placeholder('GTM-T4M9PSPK')
                            ->helperText('আপনার GTM কন্টেইনার আইডি (যেমন: GTM-T4M9PSPK)। এটি সাইটে gtm.js এবং dataLayer লোড করে।')
                            ->required(),

                        TextInput::make('google_analytics_id')
                            ->label('Google Analytics (GA4) Measurement ID (ঐচ্ছিক)')
                            ->placeholder('G-XXXXXXXXXX')
                            ->helperText('ঐচ্ছিক GA4 Measurement ID। সরাসরি GA4 কনফিগারেশন পাঠাতে চাইলে বসান।'),
                    ]),

                Section::make('কাস্টম ট্র্যাকিং ও ভেরিফিকেশন কোড (ঐচ্ছিক)')
                    ->description('অতিরিক্ত কোনো মেটা পিক্সেল, হটজার, মাইক্রোসফট ক্ল্যারিটি বা কাস্টম এইচটিএমএল/জাভাস্ক্রিপ্ট কোড বসাতে চাইলে এখানে পেস্ট করুন।')
                    ->schema([
                        Textarea::make('custom_header_scripts')
                            ->label('Custom Header Scripts (<head> এর ভেতর বসবে)')
                            ->rows(4)
                            ->placeholder("<script>\n  // কাস্টম হেড ট্র্যাকিং কোড\n</script>"),

                        Textarea::make('custom_footer_scripts')
                            ->label('Custom Footer Scripts (<body> এর একদম শেষে বসবে)')
                            ->rows(3)
                            ->placeholder("<script>\n  // কাস্টম চ্যাট উইজেট বা ফুটার স্ক্রিপ্ট\n</script>"),
                    ])
                    ->collapsed(),
            ])
            ->statePath('data');
    }

    public function save(): void
    {
        $state = $this->form->getState();

        Setting::updateOrCreate(
            ['key' => 'google_analytics_enabled'],
            [
                'value' => !empty($state['google_analytics_enabled']) ? '1' : '0',
                'group' => 'analytics',
                'type' => 'boolean',
                'label' => 'Enable Google Analytics & GTM Tracking',
                'description' => 'মাস্টার সুইচ - সাইটে গুগল অ্যানালিটিক্স ও ট্যাগ ম্যানেজার ট্র্যাকিং চালু বা বন্ধ রাখার জন্য।',
                'is_public' => true,
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'google_tag_manager_id'],
            [
                'value' => trim($state['google_tag_manager_id'] ?? ''),
                'group' => 'analytics',
                'type' => 'text',
                'label' => 'Google Tag Manager (GTM) Container ID',
                'description' => 'Google Tag Manager কন্টেইনার আইডি (যেমন: GTM-T4M9PSPK)।',
                'is_public' => true,
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'google_analytics_id'],
            [
                'value' => trim($state['google_analytics_id'] ?? ''),
                'group' => 'analytics',
                'type' => 'text',
                'label' => 'Google Analytics (GA4) Measurement ID',
                'description' => 'ঐচ্ছিক GA4 Measurement ID (যেমন: G-XXXXXXXXXX)।',
                'is_public' => true,
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'custom_header_scripts'],
            [
                'value' => trim($state['custom_header_scripts'] ?? ''),
                'group' => 'analytics',
                'type' => 'textarea',
                'label' => 'Custom Header Scripts / Head Tracking Code',
                'description' => 'কাস্টম ট্র্যাকিং বা মেটা ভেরিফিকেশন স্ক্রিপ্ট।',
                'is_public' => true,
            ]
        );

        Setting::updateOrCreate(
            ['key' => 'custom_footer_scripts'],
            [
                'value' => trim($state['custom_footer_scripts'] ?? ''),
                'group' => 'analytics',
                'type' => 'textarea',
                'label' => 'Custom Footer Scripts / Body End Code',
                'description' => 'কাস্টম ফুটার স্ক্রিপ্ট।',
                'is_public' => true,
            ]
        );

        Cache::forget('app_public_settings');
        Cache::forget('api_home_payload');

        Notification::make()
            ->title('অ্যানালিটিক্স সেটিংস সফলভাবে সংরক্ষিত হয়েছে!')
            ->body('Google Tag Manager (GTM) ও Analytics সেটিংস আপডেট করা হয়েছে। সাইটে রিয়েল-টাইমে কার্যকর হবে।')
            ->success()
            ->send();
    }
}
