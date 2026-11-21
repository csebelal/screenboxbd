<?php

namespace App\Filament\Resources\SubscriptionPlans\Pages;

use App\Filament\Resources\SubscriptionPlans\SubscriptionPlanResource;
use App\Models\Setting;
use Filament\Actions\Action;
use Filament\Actions\CreateAction;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Support\Facades\Cache;

class ListSubscriptionPlans extends ListRecords
{
    protected static string $resource = SubscriptionPlanResource::class;

    protected function getHeaderActions(): array
    {
        $isEnabled = Setting::get('enable_subscriptions', false);

        return [
            Action::make('toggle_site_subscriptions')
                ->label($isEnabled ? 'Website Status: ACTIVE (বন্ধ/হাইড করতে ক্লিক করুন)' : 'Website Status: HIDDEN (চালু/শো করতে ক্লিক করুন)')
                ->icon($isEnabled ? 'heroicon-o-eye-slash' : 'heroicon-o-eye')
                ->color($isEnabled ? 'danger' : 'success')
                ->requiresConfirmation()
                ->modalHeading($isEnabled ? 'Disable Subscriptions on Website?' : 'Enable Subscriptions on Website?')
                ->modalDescription($isEnabled 
                    ? 'হোমপেজের প্রাইসিং প্ল্যান সেকশন এবং মেনু বার থেকে Subscription লিংক হাইড করা হবে।' 
                    : 'হোমপেজে প্রাইসিং প্ল্যান সেকশন এবং মেনু বারে Subscription লিংক দৃশ্যমান করা হবে।'
                )
                ->action(function () use ($isEnabled) {
                    Setting::set('enable_subscriptions', !$isEnabled, 'monetization');
                    Cache::forget('app_public_settings');
                    Cache::forget('api_home_payload');

                    Notification::make()
                        ->title(!$isEnabled 
                            ? 'Subscriptions Enabled on Website! (হোমপেজ ও মেনু বারে দৃশ্যমান)' 
                            : 'Subscriptions Disabled on Website! (হোমপেজ ও মেনু বার থেকে লুকানো)'
                        )
                        ->success()
                        ->send();
                }),
            CreateAction::make(),
        ];
    }
}
