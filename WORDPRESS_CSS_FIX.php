<?php
/**
 * INSTRUKSI: Tambahkan kode ini ke functions.php theme Twenty Twenty-Five
 * File: wp-content/themes/twentytwentyfive/functions.php
 * 
 * FUNGSI: Disable theme CSS ketika Next.js frontend di-serve ke prevent CSS conflicts
 */

// ============================================================================
// COPY & PASTE KODE INI KE functions.php SETELAH SEMUA FUNCTION LAIN
// ============================================================================

/**
 * Disable Twenty Twenty-Five theme stylesheet to prevent conflicts with Next.js
 * The Next.js frontend handles all styling, WordPress theme CSS would interfere
 * 
 * @since 1.0
 * @return void
 */
function ait_disable_theme_styles() {
    // Remove the default theme stylesheet completely
    wp_dequeue_style( 'twentytwentyfive-style' );
    
    // Remove any inline theme styles
    wp_dequeue_style( 'global-styles' );
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
}
// Run with high priority to override theme's enqueue (priority 11)
add_action( 'wp_enqueue_scripts', 'ait_disable_theme_styles', 11 );

/**
 * Also disable theme styles in REST API responses
 * Prevents theme CSS from being included in API responses
 * 
 * @since 1.0
 * @return void
 */
function ait_remove_theme_styles_from_admin() {
    if ( is_admin() ) {
        return; // Keep styles in WordPress admin
    }
    
    // Remove block styles in frontend only
    wp_dequeue_style( 'wp-block-library' );
}
add_action( 'wp_enqueue_scripts', 'ait_remove_theme_styles_from_admin', 12 );

/**
 * Minimal CSS reset to ensure Next.js frontend displays correctly
 * Only load when NOT in WordPress admin
 * 
 * @since 1.0
 * @return void
 */
function ait_enqueue_nextjs_compatibility_styles() {
    if ( is_admin() ) {
        return; // Don't load in admin
    }
    
    // Minimal reset for Next.js frontend - just clear conflicts
    $inline_css = "
    /* AIT Next.js Frontend Compatibility */
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
    }
    
    /* Ensure SVG from Next.js renders at correct size */
    svg {
        max-width: 100% !important;
        height: auto !important;
    }
    
    /* Prevent WordPress container styles from interfering */
    body > * {
        all: revert !important;
    }
    
    /* Allow Next.js layout to work */
    body > main {
        all: initial !important;
    }
    ";
    
    wp_add_inline_style( 'wp-block-library', $inline_css );
}
add_action( 'wp_enqueue_scripts', 'ait_enqueue_nextjs_compatibility_styles', 999 );

/**
 * Remove WordPress editor blocks that interfere with Next.js
 * This prevents Gutenberg from trying to render content
 *
 * @since 1.0
 * @return void
 */
function ait_disable_editor_features() {
    if ( is_admin() ) {
        return;
    }
    
    // Remove any Gutenberg block library CSS
    wp_dequeue_style( 'wp-editor' );
    wp_dequeue_style( 'wp-format-library' );
}
add_action( 'wp_enqueue_scripts', 'ait_disable_editor_features', 10 );

/**
 * Optional: Hide WordPress admin bar completely when frontend is served
 * This is redundant since JavaScript removes it, but ensures it's gone
 *
 * @since 1.0
 * @return void
 */
function ait_hide_admin_bar_completely() {
    // Already handled by JavaScript in Next.js layout.tsx
    // This is just a backup
    remove_action( 'wp_footer', 'wp_admin_bar_render' );
}
add_action( 'wp_head', 'ait_hide_admin_bar_completely' );

// ============================================================================
// SELESAI - Simpan functions.php Anda
// ============================================================================
