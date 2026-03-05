<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Couple Information
    |--------------------------------------------------------------------------
    |
    | Basic information about the couple getting married.
    |
    */

    'couple' => [
        'partner1' => [
            'name' => 'Ian Jay',
            'full_name' => 'Ian Jay Broñola',
        ],
        'partner2' => [
            'name' => 'Karen Kate',
            'full_name' => 'Karen Kate Seronay',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Wedding Date & Time
    |--------------------------------------------------------------------------
    |
    | The date and time of your wedding ceremony.
    |
    */

    'date' => [
        'ceremony' => '2026-07-17 07:00:00', // July 17, 2026 at 7:00 AM
        'reception' => '2026-07-17 10:00:00', // Same day, 10:00 AM (adjust as needed)
        'timezone' => 'Asia/Manila',
    ],

    /*
    |--------------------------------------------------------------------------
    | Venue Information
    |--------------------------------------------------------------------------
    |
    | Details about your wedding venue(s).
    |
    */

    'venue' => [
        'ceremony' => [
            'name' => 'Butuan City Cathedral',
            'address' => 'Montilla Boulevard',
            'city' => 'Butuan City',
            'state' => 'Agusan del Norte',
            'zip' => '8600',
            'country' => 'Philippines',
            'google_maps_url' => null, // Add Google Maps link here when available
        ],
        'reception' => [
            'name' => 'Butuan Watergate',
            'address' => 'To be confirmed',
            'city' => 'Butuan City',
            'state' => 'Agusan del Norte',
            'zip' => '8600',
            'country' => 'Philippines',
            'google_maps_url' => null,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | RSVP Settings
    |--------------------------------------------------------------------------
    |
    | Configuration for RSVP functionality.
    |
    */

    'rsvp' => [
        'enabled' => true,
        'deadline' => null, // e.g., '2026-05-01'
        'max_guests_per_invite' => 5,
        'allow_plus_ones' => true,
        'meal_choices' => [
            // 'Chicken',
            // 'Fish',
            // 'Vegetarian',
            // 'Vegan',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Registry Links
    |--------------------------------------------------------------------------
    |
    | Links to your wedding gift registries.
    |
    */

    'registries' => [
        // [
        //     'name' => 'Amazon',
        //     'url' => 'https://amazon.com/wedding/registry/...',
        // ],
        // [
        //     'name' => 'Target',
        //     'url' => 'https://target.com/gift-registry/...',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Accommodations
    |--------------------------------------------------------------------------
    |
    | Recommended hotels or accommodations for guests.
    |
    */

    'accommodations' => [
        // [
        //     'name' => 'Hotel Name',
        //     'address' => '789 Hotel Street',
        //     'phone' => '+1-234-567-8900',
        //     'website' => 'https://hotel.com',
        //     'discount_code' => 'WEDDING2026',
        //     'notes' => 'Mention our wedding for a special rate',
        // ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Contact Information
    |--------------------------------------------------------------------------
    |
    | Contact details for wedding-related questions.
    |
    */

    'contact' => [
        'email' => 'your-email@example.com',
        'phone' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | Social Media
    |--------------------------------------------------------------------------
    |
    | Social media hashtags and links for your wedding.
    |
    */

    'social' => [
        'hashtag' => null, // e.g., '#SmithWedding2026'
        'instagram' => null,
        'facebook_event' => null,
    ],

    /*
    |--------------------------------------------------------------------------
    | Theme Colors
    |--------------------------------------------------------------------------
    |
    | Primary colors for your wedding theme - Elegant Starry Night.
    |
    */

    'theme' => [
        'primary_color' => '#fbbf24', // gold/amber-400
        'secondary_color' => '#1e3a8a', // deep blue-900
        'accent_color' => '#7c3aed', // violet-600
        'background' => '#0f172a', // slate-900 (night sky)
    ],

    /*
    |--------------------------------------------------------------------------
    | Features
    |--------------------------------------------------------------------------
    |
    | Enable or disable specific features on your wedding website.
    |
    */

    'features' => [
        'photo_gallery' => true,
        'guestbook' => true,
        'livestream' => false,
        'countdown' => true,
        'registry' => true,
        'accommodations' => true,
    ],

];
