# WordPress Integration - Safe PHP Script

## Masalah SVG2 yang Mendominasi Tampilan

Jika tampilan website berantakan dengan SVG2 yang berukuran besar setelah menambahkan PHP script, gunakan script berikut yang lebih aman:

```php
<?php
/**
 * Safe WordPress Proxy for Next.js App
 * Plugin Name: AIT Safe Proxy
 * Description: Safe proxy untuk AIT Next.js application
 * Version: 1.0
 * Author: AIT Team
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Only run on frontend, not in admin
if (is_admin()) {
    return;
}

// Only run on specific page (ganti 'home' dengan slug halaman Anda)
if (!is_page('home') && !is_front_page()) {
    return;
}

// Disable all WordPress theme styles and scripts
add_action('wp_enqueue_scripts', function() {
    // Remove all theme styles
    global $wp_styles;
    if ($wp_styles) {
        foreach ($wp_styles->queue as $handle) {
            wp_dequeue_style($handle);
        }
    }

    // Remove all theme scripts
    global $wp_scripts;
    if ($wp_scripts) {
        foreach ($wp_scripts->queue as $handle) {
            wp_dequeue_script($handle);
        }
    }
}, 999);

// Remove WordPress header actions that might inject content
remove_action('wp_head', 'wp_generator');
remove_action('wp_head', 'wlwmanifest_link');
remove_action('wp_head', 'rsd_link');
remove_action('wp_head', 'wp_shortlink_wp_head');
remove_action('wp_head', 'feed_links', 2);
remove_action('wp_head', 'feed_links_extra', 3);

// Remove emoji scripts
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

// Remove admin bar
add_filter('show_admin_bar', '__return_false');

// Clean up body classes
add_filter('body_class', function($classes) {
    return array();
});

// Main proxy function
add_action('template_redirect', function() {
    // Only proxy if this is our target page
    if (!is_page('home') && !is_front_page()) {
        return;
    }

    // Clean output buffer
    if (ob_get_level()) {
        ob_clean();
    }

    // Set proper headers
    header('Content-Type: text/html; charset=UTF-8');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-Content-Type-Options: nosniff');

    // Get the Next.js app content
    $nextjs_url = 'https://your-vercel-app.vercel.app'; // Ganti dengan URL Vercel Anda

    $context = stream_context_create([
        'http' => [
            'method' => 'GET',
            'header' => [
                'User-Agent: WordPress-AIT-Proxy/1.0',
                'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language: id,en-US;q=0.7,en;q=0.3',
                'Accept-Encoding: gzip, deflate',
                'Connection: close'
            ],
            'timeout' => 30,
        ],
        'ssl' => [
            'verify_peer' => true,
            'verify_peer_name' => true,
        ]
    ]);

    $content = file_get_contents($nextjs_url, false, $context);

    if ($content === false) {
        // Fallback if proxy fails
        echo '<!DOCTYPE html><html><head><title>Error</title></head><body><h1>Service Temporarily Unavailable</h1></body></html>';
        exit;
    }

    // Output the content
    echo $content;
    exit;
});
```

## Cara Menggunakan Script Aman:

1. **Backup functions.php** Anda terlebih dahulu
2. **Ganti URL Vercel** di baris `$nextjs_url = 'https://your-vercel-app.vercel.app';`
3. **Ganti slug halaman** di kondisi `is_page('home')` sesuai dengan halaman Anda
4. **Upload dan test** secara bertahap

## Jika Masih Bermasalah:

1. **Periksa Console Browser** untuk error JavaScript
2. **Nonaktifkan plugin WordPress** satu per satu untuk menemukan konflik
3. **Gunakan tema default WordPress** (Twenty Twenty-One) untuk testing
4. **Periksa .htaccess** untuk redirect yang mungkin mengganggu

## Alternatif: Gunakan iframe (Lebih Aman)

Jika proxy masih bermasalah, gunakan iframe sebagai fallback:

```php
<div style="width: 100%; height: 100vh; border: none;">
    <iframe
        src="https://your-vercel-app.vercel.app"
        style="width: 100%; height: 100%; border: none;"
        title="AIT Training Platform">
    </iframe>
</div>
```