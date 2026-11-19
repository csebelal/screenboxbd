<?php

namespace Database\Seeders;

use App\Models\Movie;
use App\Models\MovieStream;
use App\Models\Series;
use App\Models\Season;
use App\Models\Episode;
use App\Models\EpisodeStream;
use Illuminate\Database\Seeder;

class BanglaOttSeeder extends Seeder
{
    /**
     * Seed top Chorki & Hoichoi Bangla OTT Originals with verified TMDB artwork.
     */
    public function run(): void
    {
        $hlsSample1 = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
        $hlsSample2 = 'https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8';
        $mp4Sample = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

        // ==========================================
        // 1. CHORKI ORIGINALS (চরকি অরিজিনালস)
        // ==========================================
        $chorkiItems = [
            [
                'title' => 'Toofan (তুফান)',
                'slug' => 'toofan',
                'tmdb_id' => 1216385,
                'ott_platform' => 'chorki',
                'overview' => 'In 1990s Bangladesh, Galib rises through the underworld to become Toofan, a ruthless gangster determined to take over the criminal empire of Dhaka.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/pgkrMs6XKEcJhVPHsA0bZRQJbDx.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/gulpbpfwzaC6ls7w7XYON7KqWc5.jpg',
                'release_date' => '2024-06-17',
                'duration_minutes' => 145,
                'rating' => 8.9,
                'genres' => ['Action', 'Crime', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 45200,
            ],
            [
                'title' => 'Surongo (সুড়ঙ্গ)',
                'slug' => 'surongo',
                'tmdb_id' => 1055288,
                'ott_platform' => 'chorki',
                'overview' => 'Masud, an electrician desperate to win back his wife, digs an impossible underground tunnel to rob a bank vault in a gripping heist thriller.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/q5OshR7S6ZKWvPr5lqIh5hfUxo2.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/dHjxZF4x22JShswqq4pZGbxDvRL.jpg',
                'release_date' => '2023-06-29',
                'duration_minutes' => 150,
                'rating' => 8.7,
                'genres' => ['Crime', 'Drama', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 38900,
            ],
            [
                'title' => 'Syndicate (সিন্ডিকেট)',
                'slug' => 'syndicate',
                'tmdb_id' => 205845,
                'ott_platform' => 'chorki',
                'overview' => 'An employee at a well known bank in Dhaka falls from the rooftop. Her coworker Adnan investigates and discovers it was murder by a deep criminal syndicate.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/si5X3UeJNiwQKkR5iV4pWpn5szy.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/l1piIi3GQLVdmdr8v5whig08asG.jpg',
                'release_date' => '2022-07-10',
                'duration_minutes' => 42,
                'rating' => 9.1,
                'genres' => ['Crime', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 61000,
            ],
            [
                'title' => 'Pett Kata Shaw (পেট কাটা ষ)',
                'slug' => 'pett-kata-shaw',
                'tmdb_id' => 197610,
                'ott_platform' => 'chorki',
                'overview' => 'A psychological folk horror anthology reinventing timeless traditional Bengali ghost stories and folk tales in modern chilling settings.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/dNQ2bAOiZLJdQoYEFz0wWhOKgZV.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/cu9Tg73EkdwYb5WpNfIorJHiTNn.jpg',
                'release_date' => '2022-04-07',
                'duration_minutes' => 35,
                'rating' => 8.8,
                'genres' => ['Horror', 'Mystery', 'Thriller', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 29400,
            ],
            [
                'title' => 'Forget Me Not (ফরগেট মি নট)',
                'slug' => 'forget-me-not',
                'tmdb_id' => 1352190,
                'ott_platform' => 'chorki',
                'overview' => 'Following university student Fahim\'s crisis, his lover and mother embark on a deep introspective journey discovering the distinct meanings of love and loss.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/AoDMqNSaqrrKoRvQ9ftLzMcJT8L.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/AmH4FKRJC6R8ShWINthIwr0q5OP.jpg',
                'release_date' => '2024-09-05',
                'duration_minutes' => 98,
                'rating' => 8.5,
                'genres' => ['Drama', 'Mystery', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 24100,
            ],
            [
                'title' => 'Friday (ফ্রাইডে)',
                'slug' => 'friday',
                'tmdb_id' => 1084749,
                'ott_platform' => 'chorki',
                'overview' => 'A woman calls 999 not for help, but to surrender to police after chilling events on a stormy Friday unravel unexpected crimes.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/ttQ1D2dlhZEd0PuKR8qPV0higco.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/hO7rMHUkl6xbZ7ZeMp8JIh8vvaE.jpg',
                'release_date' => '2023-03-01',
                'duration_minutes' => 105,
                'rating' => 8.3,
                'genres' => ['Thriller', 'Crime', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 18900,
            ],
            [
                'title' => 'Redrum (রেডরাম)',
                'slug' => 'redrum',
                'tmdb_id' => 936267,
                'ott_platform' => 'chorki',
                'overview' => 'Famous musician Sohel is found murdered in his bedroom. Detective Rashed dives into the past where every lie is a badly expressed truth.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/eZdk4K2CeqMwlm19UDwCB6wYzph.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/4flCm7WbiZYIaHawPmvaiHrzkno.jpg',
                'release_date' => '2022-02-17',
                'duration_minutes' => 110,
                'rating' => 8.4,
                'genres' => ['Crime', 'Mystery', 'Thriller', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 26300,
            ],
        ];

        // ==========================================
        // 2. HOICHOI ORIGINALS (হইচই অরিজিনালস)
        // ==========================================
        $hoichoiItems = [
            [
                'title' => 'Karagar (কারাগার)',
                'slug' => 'karagar',
                'tmdb_id' => 207305,
                'ott_platform' => 'hoichoi',
                'overview' => 'A mystery prisoner appears inside cell 145 of Akashnagar Central Jail, which has been locked for 50 years, claiming to have lived for 250 years.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/8tLoJ31NLwhlP5PjJItBCptRV4t.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/7Rwgh3wXq9vbIocPbYFoTREY7mE.jpg',
                'release_date' => '2022-08-19',
                'duration_minutes' => 135,
                'rating' => 9.3,
                'genres' => ['Mystery', 'Thriller', 'Drama', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 74800,
            ],
            [
                'title' => 'Mohanagar (মহানগর)',
                'slug' => 'mohanagar',
                'tmdb_id' => 128073,
                'ott_platform' => 'hoichoi',
                'overview' => 'OC Harun Rashid faces the most challenging 7 hours of his police career at Kotwali Police Station after arresting a powerful industrialist\'s son.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/bhmI8l62JIc0AuURN4ZL7i6t82K.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/x177ad5loAY8mXfEZIgY4nmNd3F.jpg',
                'release_date' => '2021-06-25',
                'duration_minutes' => 140,
                'rating' => 9.2,
                'genres' => ['Crime', 'Drama', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 82100,
            ],
            [
                'title' => 'Taqdeer (তাকদীর)',
                'slug' => 'taqdeer',
                'tmdb_id' => 114809,
                'ott_platform' => 'hoichoi',
                'overview' => 'A freezer van driver Taqdeer discovers an unidentified female corpse in his van, pulling him into a high-stakes conspiracy of corrupt journalists and detectives.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/nXgDr8WmsTRkzHvAKqYuLN991lS.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/vk321e1H1XkHylOBXIn6easmk44.jpg',
                'release_date' => '2020-12-18',
                'duration_minutes' => 120,
                'rating' => 9.0,
                'genres' => ['Mystery', 'Crime', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 69500,
            ],
            [
                'title' => 'Byomkesh (ব্যোমকেশ)',
                'slug' => 'byomkesh',
                'tmdb_id' => 75964,
                'ott_platform' => 'hoichoi',
                'overview' => 'The celebrated Satyanweshi Byomkesh Bakshi and his trusted companion Ajit solve intricate and dangerous crimes in vintage colonial Calcutta.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/aFQKRML4ttKLTRXbZbtEsOq5qcX.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/Aq2gYNSuQz6N7sMBXrZ9a9v8kTQ.jpg',
                'release_date' => '2017-10-14',
                'duration_minutes' => 115,
                'rating' => 8.6,
                'genres' => ['Mystery', 'Detective', 'Period', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 31200,
            ],
            [
                'title' => 'Shikarpur (শিকারপুর)',
                'slug' => 'shikarpur',
                'tmdb_id' => 217731,
                'ott_platform' => 'hoichoi',
                'overview' => 'An eccentric small-town detective Keshto solves a sequence of bizarre murders rocking the tranquil hills of Shikarpur.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/qmTQCZxK6TAetG2IfYRqlcCKgFq.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/itOgYtwEscffEyDG9nJkWJQgeXP.jpg',
                'release_date' => '2023-01-06',
                'duration_minutes' => 125,
                'rating' => 8.4,
                'genres' => ['Comedy', 'Mystery', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 27800,
            ],
            [
                'title' => 'Indubala Bhaater Hotel (ইন্দুবালা ভাতের হোটেল)',
                'slug' => 'indubala-bhaater-hotel',
                'tmdb_id' => 221837,
                'ott_platform' => 'hoichoi',
                'overview' => 'From rural Bangladesh to establishing a beloved food sanctuary in Kolkata, Indubala\'s journey is an emotional tale of love, displacement and memories.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/uIi4LyfbJuI90yKkm5M1HxNajN5.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/a2akocFs3jhKctfTQfh88fKDcQR.jpg',
                'release_date' => '2023-03-08',
                'duration_minutes' => 130,
                'rating' => 8.7,
                'genres' => ['Drama', 'Family', 'History', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 34500,
            ],
            [
                'title' => 'Mandaar (মন্দার)',
                'slug' => 'mandaar',
                'tmdb_id' => 138247,
                'ott_platform' => 'hoichoi',
                'overview' => 'A fiery coastal adaptation of Macbeth set along the dangerous sands and tides of Geilpur where greed, prophecy and ruthlessness collide.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/4Bug1HjgPQwFPVhngIJw4SBGqvq.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/rQIFaltggglEtciyURVX266WYnj.jpg',
                'release_date' => '2021-11-19',
                'duration_minutes' => 132,
                'rating' => 8.8,
                'genres' => ['Drama', 'Crime', 'Thriller', 'Bangla OTT'],
                'is_featured' => false,
                'views' => 39100,
            ],
        ];

        // Seed Movies
        $allOttMovies = array_merge($chorkiItems, $hoichoiItems);

        foreach ($allOttMovies as $data) {
            $movie = Movie::updateOrCreate(
                ['tmdb_id' => $data['tmdb_id']],
                [
                    'title' => $data['title'],
                    'slug' => $data['slug'],
                    'ott_platform' => $data['ott_platform'],
                    'overview' => $data['overview'],
                    'poster_url' => $data['poster_url'],
                    'backdrop_url' => $data['backdrop_url'],
                    'release_date' => $data['release_date'],
                    'duration_minutes' => $data['duration_minutes'],
                    'rating' => $data['rating'],
                    'genres' => $data['genres'],
                    'is_published' => true,
                    'is_featured' => $data['is_featured'],
                    'views' => $data['views'],
                ]
            );

            // Add High Quality Multi-Server Streams
            $movie->streams()->delete();
            $movie->streams()->createMany([
                [
                    'server_name' => "Server 1: Fast HD Stream (HLS)",
                    'stream_type' => 'hls',
                    'stream_url' => $hlsSample1,
                    'quality' => '1080p',
                    'priority' => 1,
                ],
                [
                    'server_name' => 'Server 2: BDIX Ultra Stream',
                    'stream_type' => 'hls',
                    'stream_url' => $hlsSample2,
                    'quality' => '720p',
                    'priority' => 2,
                ],
                [
                    'server_name' => 'Backup Direct Server (MP4)',
                    'stream_type' => 'mp4',
                    'stream_url' => $mp4Sample,
                    'quality' => 'Auto',
                    'priority' => 3,
                ],
            ]);
        }

        // ==========================================
        // 3. BANGLA OTT SERIES (ওয়েব সিরিজ)
        // ==========================================
        $seriesItems = [
            [
                'title' => 'Karagar (কারাগার)',
                'slug' => 'karagar-series',
                'tmdb_id' => 207305,
                'ott_platform' => 'hoichoi',
                'overview' => 'Mystery unravels in Akashnagar Central Jail around an enigmatic prisoner in cell 145.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/8tLoJ31NLwhlP5PjJItBCptRV4t.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/7Rwgh3wXq9vbIocPbYFoTREY7mE.jpg',
                'first_air_date' => '2022-08-19',
                'rating' => 9.3,
                'genres' => ['Mystery', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 92000,
                'seasons_count' => 2,
                'episodes_per_season' => 7,
            ],
            [
                'title' => 'Mohanagar (মহানগর)',
                'slug' => 'mohanagar-series',
                'tmdb_id' => 128073,
                'ott_platform' => 'hoichoi',
                'overview' => 'OC Harun navigating a stormy Dhaka night full of police power plays and moral crises.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/bhmI8l62JIc0AuURN4ZL7i6t82K.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/x177ad5loAY8mXfEZIgY4nmNd3F.jpg',
                'first_air_date' => '2021-06-25',
                'rating' => 9.2,
                'genres' => ['Crime', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 105000,
                'seasons_count' => 2,
                'episodes_per_season' => 8,
            ],
            [
                'title' => 'Syndicate (সিন্ডিকেট)',
                'slug' => 'syndicate-series',
                'tmdb_id' => 205845,
                'ott_platform' => 'chorki',
                'overview' => 'A bank employee jumps from the rooftop, sending her coworker into the belly of an underworld cartel.',
                'poster_url' => 'https://image.tmdb.org/t/p/w500/si5X3UeJNiwQKkR5iV4pWpn5szy.jpg',
                'backdrop_url' => 'https://image.tmdb.org/t/p/original/l1piIi3GQLVdmdr8v5whig08asG.jpg',
                'first_air_date' => '2022-07-10',
                'rating' => 9.1,
                'genres' => ['Crime', 'Thriller', 'Bangla OTT'],
                'is_featured' => true,
                'views' => 77000,
                'seasons_count' => 1,
                'episodes_per_season' => 7,
            ],
        ];

        foreach ($seriesItems as $sData) {
            $series = Series::updateOrCreate(
                ['tmdb_id' => $sData['tmdb_id']],
                [
                    'title' => $sData['title'],
                    'slug' => $sData['slug'],
                    'ott_platform' => $sData['ott_platform'],
                    'overview' => $sData['overview'],
                    'poster_url' => $sData['poster_url'],
                    'backdrop_url' => $sData['backdrop_url'],
                    'first_air_date' => $sData['first_air_date'],
                    'rating' => $sData['rating'],
                    'genres' => $sData['genres'],
                    'is_published' => true,
                    'is_featured' => $sData['is_featured'],
                    'views' => $sData['views'],
                ]
            );

            // Create seasons & episodes
            for ($s = 1; $s <= $sData['seasons_count']; $s++) {
                $season = Season::updateOrCreate(
                    [
                        'series_id' => $series->id,
                        'season_number' => $s,
                    ],
                    [
                        'title' => "Season {$s}",
                        'poster_url' => $series->poster_url,
                    ]
                );

                for ($e = 1; $e <= $sData['episodes_per_season']; $e++) {
                    $episode = Episode::updateOrCreate(
                        [
                            'season_id' => $season->id,
                            'episode_number' => $e,
                        ],
                        [
                            'title' => "Episode {$e}: " . ($e === 1 ? 'The Beginning' : "Plot Twist {$e}"),
                            'overview' => "A gripping unfolding of events in episode {$e} of {$series->title}.",
                            'still_url' => $series->backdrop_url,
                            'duration_minutes' => 38,
                        ]
                    );

                    $episode->streams()->delete();
                    $episode->streams()->createMany([
                        [
                            'server_name' => 'Fast CDN HLS',
                            'stream_type' => 'hls',
                            'stream_url' => $hlsSample1,
                            'quality' => '1080p',
                            'priority' => 1,
                        ],
                        [
                            'server_name' => 'BDIX Fast Server',
                            'stream_type' => 'hls',
                            'stream_url' => $hlsSample2,
                            'quality' => '720p',
                            'priority' => 2,
                        ],
                    ]);
                }
            }
        }
    }
}
