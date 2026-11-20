<x-filament-panels::page>
    <div class="space-y-6">
        @php
            $stats = $this->getStats();
        @endphp

        {{-- 1. Real-time Content & Automation Counter --}}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
            <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; display: flex; align-items: center; justify-content: center;">
                    <x-filament::icon icon="heroicon-o-film" style="width: 24px; height: 24px;" />
                </div>
                <div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">{{ $stats['movies'] }}</div>
                    <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Total Movies</div>
                </div>
            </div>

            <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); color: #10b981; display: flex; align-items: center; justify-content: center;">
                    <x-filament::icon icon="heroicon-o-tv" style="width: 24px; height: 24px;" />
                </div>
                <div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">{{ $stats['series'] }}</div>
                    <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Web & TV Series</div>
                </div>
            </div>

            <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(59, 130, 246, 0.15); color: #3b82f6; display: flex; align-items: center; justify-content: center;">
                    <x-filament::icon icon="heroicon-o-rectangle-stack" style="width: 24px; height: 24px;" />
                </div>
                <div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">{{ $stats['episodes'] }}</div>
                    <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Total Episodes</div>
                </div>
            </div>

            <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(236, 72, 153, 0.15); color: #ec4899; display: flex; align-items: center; justify-content: center;">
                    <x-filament::icon icon="heroicon-o-sparkles" style="width: 24px; height: 24px;" />
                </div>
                <div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">{{ $stats['natok'] }}</div>
                    <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Bangla Natok & OTT</div>
                </div>
            </div>

            <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(168, 85, 247, 0.15); color: #a855f7; display: flex; align-items: center; justify-content: center;">
                    <x-filament::icon icon="heroicon-o-bolt" style="width: 24px; height: 24px;" />
                </div>
                <div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">{{ $stats['bdix'] }}</div>
                    <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">BDIX ISP Streams</div>
                </div>
            </div>

            <div style="padding: 16px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(14, 165, 233, 0.15); color: #0ea5e9; display: flex; align-items: center; justify-content: center;">
                    <x-filament::icon icon="heroicon-o-arrow-down-tray" style="width: 24px; height: 24px;" />
                </div>
                <div>
                    <div style="font-size: 1.5rem; font-weight: 800; color: #fff;">{{ $stats['torrents'] }}</div>
                    <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 500;">Torrent Magnets</div>
                </div>
            </div>
        </div>

        {{-- 2. Automation Engines Section --}}
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px;">
            {{-- Card 1: BDIX 10Gbps Network Crawler (Option A) --}}
            <x-filament::section>
                <x-slot name="heading">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="color: #a855f7;">
                            <x-filament::icon icon="heroicon-o-bolt" style="width: 20px; height: 20px;" />
                        </div>
                        <span style="font-weight: 700; font-size: 1.05rem;">BDIX 10Gbps Crawler</span>
                    </div>
                </x-slot>
                <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                    Scan CircleFTP, SamOnline, AmberIT or custom local ISP open directories for instant 100Mbps bufferless streams.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <x-filament::button
                        wire:click="mountAction('scanBdix')"
                        icon="heroicon-m-bolt"
                        color="info"
                        size="sm"
                    >
                        ⚡ Scan BDIX Network
                    </x-filament::button>
                </div>
            </x-filament::section>

            {{-- Card 2: Debrid 10Gbps Cloud VIP Resolver (Option B) --}}
            <x-filament::section>
                <x-slot name="heading">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="color: #f59e0b;">
                            <x-filament::icon icon="heroicon-o-rocket-launch" style="width: 20px; height: 20px;" />
                        </div>
                        <span style="font-weight: 700; font-size: 1.05rem;">Debrid Cloud VIP (4K)</span>
                    </div>
                </x-slot>
                <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                    Unlock 100% ad-free 4K/1080p BluRay streams via Real-Debrid and TorBox 10Gbps CDN caches.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <x-filament::button
                        wire:click="mountAction('resolveDebrid')"
                        icon="heroicon-m-rocket-launch"
                        color="primary"
                        size="sm"
                    >
                        🚀 Resolve Cloud VIP
                    </x-filament::button>
                </div>
            </x-filament::section>

            {{-- Card 3: Bangla Natok & Telefilm Studio --}}
            <x-filament::section>
                <x-slot name="heading">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="color: #ec4899;">
                            <x-filament::icon icon="heroicon-o-sparkles" style="width: 20px; height: 20px;" />
                        </div>
                        <span style="font-weight: 700; font-size: 1.05rem;">Bangla Natok Studio</span>
                    </div>
                </x-slot>
                <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                    Quick add single dramas or YouTube telefilms. Auto-fetches thumbnails and embeds in ad-free player.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <x-filament::button
                        wire:click="mountAction('addNatok')"
                        icon="heroicon-m-plus"
                        color="warning"
                        size="sm"
                    >
                        + Add Bangla Natok
                    </x-filament::button>
                </div>
            </x-filament::section>

            {{-- Card 4: TV & Web Series Expander --}}
            <x-filament::section>
                <x-slot name="heading">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div style="color: #10b981;">
                            <x-filament::icon icon="heroicon-o-tv" style="width: 20px; height: 20px;" />
                        </div>
                        <span style="font-weight: 700; font-size: 1.05rem;">Web Series Expander</span>
                    </div>
                </x-slot>
                <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                    1-Click imports complete series with seasons and episodes from TMDB with multi-engine players.
                </p>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <x-filament::button
                        wire:click="mountAction('importSeries')"
                        icon="heroicon-m-arrow-down-tray"
                        color="success"
                        size="sm"
                    >
                        Import Series
                    </x-filament::button>
                </div>
            </x-filament::section>
        </div>

        {{-- 3. CLI Commands Reference --}}
        <x-filament::section>
            <x-slot name="heading">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="color: #10b981;">
                        <x-filament::icon icon="heroicon-o-command-line" style="width: 20px; height: 20px;" />
                    </div>
                    <span style="font-weight: 700; font-size: 1.05rem;">CLI Automation Reference</span>
                </div>
            </x-slot>
            <div style="font-family: monospace; font-size: 0.75rem; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; line-height: 1.8; color: #d4d4d8;">
                <div><span style="color: #a855f7;">$</span> php artisan bdix:scan-ftp "http://circleftp.net/ftp/" --limit=50 --auto-import</div>
                <div><span style="color: #f59e0b;">$</span> php artisan debrid:resolve "Oppenheimer" --quality=1080p</div>
                <div><span style="color: #10b981;">$</span> php artisan tmdb:sync-trending --count=20</div>
                <div><span style="color: #3b82f6;">$</span> php artisan tmdb:import-series "Taqdeer" --search</div>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
