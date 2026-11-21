<div class="fi-wi-widget" style="grid-column: 1 / -1;">
    <x-filament::section>
        <x-slot name="heading">
            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 1.25rem; font-weight: 700;">ScreenBoxBD Control Center</span>
                <x-filament::badge color="success" size="sm">⚡ Full Dynamic v2.5</x-filament::badge>
            </div>
        </x-slot>

        <x-slot name="description">
            Live IPTV Channels, TMDB Movies, Ad Monetization, Subscriptions, and Platform Settings in Real-Time.
        </x-slot>

        <x-slot name="headerEnd">
            <div style="display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                <x-filament::button
                    tag="a"
                    href="http://localhost:3000"
                    target="_blank"
                    icon="heroicon-m-arrow-top-right-on-square"
                    color="primary"
                    size="sm"
                >
                    View Live Website
                </x-filament::button>

                <x-filament::button
                    tag="a"
                    href="{{ url('/admin/settings') }}"
                    icon="heroicon-m-cog-6-tooth"
                    color="gray"
                    size="sm"
                >
                    Site Settings
                </x-filament::button>
            </div>
        </x-slot>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 12px; margin-top: 8px;">
            <a href="{{ url('/admin/channels') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(16,185,129,0.15); display: flex; align-items: center; justify-content: center; color: #10b981; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-tv" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Live Channels</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Import & Streams</span>
            </a>

            <a href="{{ url('/admin/content-sync-hub') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(168,85,247,0.15); display: flex; align-items: center; justify-content: center; color: #a855f7; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-arrow-path-rounded-square" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Sync Hub</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Movies, Series, Natok</span>
            </a>

            <a href="{{ url('/admin/movies') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(245,158,11,0.15); display: flex; align-items: center; justify-content: center; color: #f59e0b; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-film" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Movies</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Manual Catalog</span>
            </a>

            <a href="{{ url('/admin/ad-placements') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(239,68,68,0.15); display: flex; align-items: center; justify-content: center; color: #ef4444; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-megaphone" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Monetization</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Banners & Ads</span>
            </a>

            <a href="{{ url('/admin/subscription-plans') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(168,85,247,0.15); display: flex; align-items: center; justify-content: center; color: #a855f7; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-credit-card" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Pricing Plans</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">BDT Subscriptions</span>
            </a>

            <a href="{{ url('/admin/blog-posts') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(6,182,212,0.15); display: flex; align-items: center; justify-content: center; color: #06b6d4; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-document-text" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Blog & SEO</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Guides & Editorial</span>
            </a>

            <a href="{{ url('/admin/settings') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(59,130,246,0.15); display: flex; align-items: center; justify-content: center; color: #3b82f6; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-cog-6-tooth" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Platform Settings</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Site & SEO Config</span>
            </a>

            <a href="{{ url('/admin/google-analytics-settings') }}" style="display: flex; flex-direction: column; align-items: center; padding: 14px 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.02); text-decoration: none; transition: all 0.2s;">
                <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(234,179,8,0.15); display: flex; align-items: center; justify-content: center; color: #eab308; margin-bottom: 8px;">
                    <x-filament::icon icon="heroicon-o-chart-bar" style="width: 20px; height: 20px;" />
                </div>
                <span style="font-size: 0.825rem; font-weight: 600; color: #f4f4f5;">Analytics & GTM</span>
                <span style="font-size: 0.7rem; color: #a1a1aa;">Google Tag Manager</span>
            </a>
        </div>
    </x-filament::section>
</div>
