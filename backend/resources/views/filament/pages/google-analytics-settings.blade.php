<x-filament-panels::page>
    <div class="mb-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-sm text-amber-200/90 flex items-start gap-3">
        <x-filament::icon icon="heroicon-o-information-circle" class="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
            <p class="font-semibold text-white">Google Analytics ও Google Tag Manager (GTM) কন্ট্রোল প্যানেল</p>
            <p class="mt-1 text-xs text-amber-200/70">
                আপনার দেওয়া <code class="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono">GTM-T4M9PSPK</code> ট্যাগ সাইটে সক্রিয় করা আছে। পরবর্তীতে কোনো আইডি পরিবর্তন বা ট্র্যাকিং বন্ধ করতে চাইলে এখান থেকে সহজেই পরিবর্তন করে সেভ করতে পারবেন।
            </p>
        </div>
    </div>

    <form wire:submit="save" class="space-y-6">
        {{ $this->form }}

        <div class="flex items-center gap-3 pt-2">
            <x-filament::button type="submit" color="primary" size="lg" icon="heroicon-m-check">
                Save Settings (সংরক্ষণ করুন)
            </x-filament::button>

            <x-filament::button
                tag="a"
                href="http://localhost:3000"
                target="_blank"
                color="gray"
                size="lg"
                icon="heroicon-m-arrow-top-right-on-square"
            >
                View Website (লাইভ সাইট দেখুন)
            </x-filament::button>
        </div>
    </form>
</x-filament-panels::page>
