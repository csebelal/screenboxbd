<x-filament-panels::page>
    @php
        $stats = $this->getStats();
    @endphp

    {{-- 1. Real-time Content & Automation Counter --}}
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; margin-bottom: 20px;">
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
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
        {{-- Card 1: TMDB Movie Engine --}}
        <x-filament::section>
            <x-slot name="heading">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="color: #f59e0b;">
                        <x-filament::icon icon="heroicon-o-film" style="width: 20px; height: 20px;" />
                    </div>
                    <span style="font-weight: 700; font-size: 1.05rem;">TMDB Movies & Cinema Engine</span>
                </div>
            </x-slot>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                Fetch official metadata, 4K posters, backdrops, cast, and trailers. Automatically attaches VidSrc, SuperEmbed, AutoEmbed, and 2Embed streaming iframes.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <x-filament::button
                    wire:click="mountAction('importMovie')"
                    icon="heroicon-m-magnifying-glass"
                    color="primary"
                    size="sm"
                >
                    Search & Import Movie
                </x-filament::button>

                <x-filament::button
                    wire:click="mountAction('syncTrendingMovies')"
                    icon="heroicon-m-fire"
                    color="danger"
                    size="sm"
                >
                    Sync Trending Movies
                </x-filament::button>
            </div>
        </x-filament::section>

        {{-- Card 2: TV & Web Series Expander --}}
        <x-filament::section>
            <x-slot name="heading">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="color: #10b981;">
                        <x-filament::icon icon="heroicon-o-tv" style="width: 20px; height: 20px;" />
                    </div>
                    <span style="font-weight: 700; font-size: 1.05rem;">TV & Web Series Expander</span>
                </div>
            </x-slot>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                1-Click imports complete TV and Web Series. Loops through every season and generates episode slots with multi-server embed players.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <x-filament::button
                    wire:click="mountAction('importSeries')"
                    icon="heroicon-m-arrow-down-tray"
                    color="success"
                    size="sm"
                >
                    Import Web Series
                </x-filament::button>

                <x-filament::button
                    tag="a"
                    href="{{ url('/admin/series') }}"
                    icon="heroicon-m-arrow-top-right-on-square"
                    color="gray"
                    size="sm"
                >
                    Manage Series
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
                    <span style="font-weight: 700; font-size: 1.05rem;">Bangla Natok & OTT Studio</span>
                </div>
            </x-slot>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                Quickly add single Bengali dramas, Eid specials, or YouTube telefilms. Auto-fetches YouTube thumbnails and sets up embed/HLS stream.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <x-filament::button
                    wire:click="mountAction('addNatok')"
                    icon="heroicon-m-plus"
                    color="warning"
                    size="sm"
                >
                    + Add Single Natok
                </x-filament::button>

                <x-filament::button
                    tag="a"
                    href="{{ url('/admin/movies?tableFilters[genres][value]=Bangla+Natok') }}"
                    icon="heroicon-m-queue-list"
                    color="gray"
                    size="sm"
                >
                    View All Natok
                </x-filament::button>
            </div>
        </x-filament::section>

        {{-- Card 4: BDIX FTP Local ISP Scanner --}}
        <x-filament::section>
            <x-slot name="heading">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="color: #a855f7;">
                        <x-filament::icon icon="heroicon-o-bolt" style="width: 20px; height: 20px;" />
                    </div>
                    <span style="font-weight: 700; font-size: 1.05rem;">BDIX FTP Open Directory Scanner</span>
                </div>
            </x-slot>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                Crawl local ISP FTP servers (e.g. CircleFTP, SamOnline, StarFTP). Cleans release filenames, matches with TMDB, and links Server 1 (BDIX Ultra-Speed).
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <x-filament::button
                    wire:click="mountAction('scanBdix')"
                    icon="heroicon-m-bolt"
                    color="success"
                    size="sm"
                >
                    Scan FTP Directory
                </x-filament::button>
            </div>
        </x-filament::section>

        {{-- Card 5: YTS Torrent & Magnet Engine --}}
        <x-filament::section>
            <x-slot name="heading">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="color: #0ea5e9;">
                        <x-filament::icon icon="heroicon-o-arrow-down-tray" style="width: 20px; height: 20px;" />
                    </div>
                    <span style="font-weight: 700; font-size: 1.05rem;">YTS Torrent & Magnet Engine</span>
                </div>
            </x-slot>
            <p style="font-size: 0.85rem; color: #a1a1aa; line-height: 1.4; margin-bottom: 16px;">
                Ingest offline 720p, 1080p, and 2160p releases with tracker-enhanced magnet links and seed health into the Download Gateway.
            </p>
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <x-filament::button
                    wire:click="mountAction('syncYts')"
                    icon="heroicon-m-arrow-down-tray"
                    color="gray"
                    size="sm"
                >
                    Sync Torrent Magnets
                </x-filament::button>
            </div>
        </x-filament::section>

        {{-- Card 6: Quick Shortcuts --}}
        <x-filament::section>
            <x-slot name="heading">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="color: #10b981;">
                        <x-filament::icon icon="heroicon-o-command-line" style="width: 20px; height: 20px;" />
                    </div>
                    <span style="font-weight: 700; font-size: 1.05rem;">Quick CLI Reference</span>
                </div>
            </x-slot>
            <div style="font-family: monospace; font-size: 0.75rem; background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; line-height: 1.6; color: #d4d4d8;">
                <div><span style="color: #10b981;">$</span> php artisan tmdb:sync-trending --count=20</div>
                <div><span style="color: #10b981;">$</span> php artisan tmdb:import-series "Taqdeer" --search</div>
                <div><span style="color: #10b981;">$</span> php artisan bdix:scan-ftp "{url}" --auto-import</div>
                <div><span style="color: #10b981;">$</span> php artisan torrent:sync-yts --limit=15</div>
            </div>
        </x-filament::section>
    </div>
</x-filament-panels::page>
