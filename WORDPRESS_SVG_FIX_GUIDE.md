# 🔧 Solusi: Memperbaiki SVG Dominan di WordPress Backend

## 📋 Masalah
Frontend Next.js tidak menampilkan dengan baik ketika di-proxy dari WordPress. Hanya SVG besar yang terlihat, CSS tidak terload.

## 🎯 Root Cause
1. **WordPress theme CSS** (`twentytwentyfive_enqueue_styles()`) sedang menimpa styling Next.js
2. **CSP Headers** yang terlalu ketat memblokir beberapa resources
3. **Theme styles conflict** dengan Next.js Tailwind CSS

---

## ✅ Solusi 3 Langkah

### LANGKAH 1: Update CSP Headers di Next.js ✓ SUDAH DILAKUKAN
File: `/next.config.ts`

Kami sudah update CSP headers untuk:
- Allow domain `ait.plai.ac.id` di semua resources
- Allow WordPress theme styles (`*.wp.com`)
- Add `media-src` untuk media files

**Status**: ✅ SELESAI

---

### LANGKAH 2: WAJIB - Disable WordPress Theme CSS di Backend

#### 🔴 PENTING: Ini adalah LANGKAH KRUSIAL

Anda harus menambahkan kode berikut ke **`functions.php`** WordPress theme Twenty Twenty-Five:

**File Path**: `wp-content/themes/twentytwentyfive/functions.php`

Tambahkan di akhir file (setelah semua function lain):

```php
<?php
// ============================================================================
// DISABLE TWENTY TWENTY-FIVE THEME CSS - NEXT.JS FRONTEND COMPATIBILITY
// ============================================================================

/**
 * Disable theme stylesheet to prevent conflicts with Next.js frontend
 */
function ait_disable_theme_styles() {
    wp_dequeue_style( 'twentytwentyfive-style' );
    wp_dequeue_style( 'global-styles' );
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
}
add_action( 'wp_enqueue_scripts', 'ait_disable_theme_styles', 11 );

/**
 * Minimal CSS compatibility layer
 */
function ait_minimal_css_reset() {
    if ( is_admin() ) return;
    
    $css = "
    html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: transparent !important;
    }
    svg {
        max-width: 100% !important;
        height: auto !important;
    }
    body > main {
        all: initial !important;
    }
    ";
    
    wp_add_inline_style( 'wp-block-library', $css );
}
add_action( 'wp_enqueue_scripts', 'ait_minimal_css_reset', 999 );

/**
 * Hide WordPress admin bar
 */
function ait_hide_admin_bar() {
    remove_action( 'wp_footer', 'wp_admin_bar_render' );
}
add_action( 'wp_head', 'ait_hide_admin_bar' );
```

**✅ Setelah di-add**: Save dan test di browser Next.js harus menampilkan dengan baik.

---

### LANGKAH 3: Domain Vercel Configuration (Opsional)
 
**Pertanyaan Anda**: "Apakah domain ait.plai.ac.id harus ditambah di Vercel?"

**Jawaban**: 
- Jika Next.js di-host di Vercel: URL environment variable perlu updated
- Jika Next.js di-proxy melalui WordPress: Domain sudah di-allow via CSP headers

**File yang sudah di-update**:
- ✅ `next.config.ts` - CSP headers include `ait.plai.ac.id`
- ✅ `app/layout.tsx` - Metadata include canonical `https://ait.plai.ac.id`

---

## 🔍 Checklist Verifikasi

Setelah implementasi, verify ini:

```bash
# 1. Check Next.js build berhasil
npm run build

# 2. Test dev server
npm run dev

# 3. Test CSP headers
curl -I http://localhost:3000

# Pastikan CSP header include:
# - ait.plai.ac.id
# - *.wp.com
# - fonts.googleapis.com
```

### Test di Browser:
- [ ] Buka WordPress dengan proxy ke Next.js
- [ ] Lihat console untuk error CSP/CORS
- [ ] Verify SVG tidak dominan lagi
- [ ] Check styling Tailwind sudah load
- [ ] Hero section, programs list, contact form visible

---

## 🚨 Jika Masih Ada Masalah

### Debug Steps:

1. **Check WordPress admin console (F12)**:
   ```
   - Apa error di console?
   - Apakah CSS terblock CSP?
   - Apakah images/fonts blocked?
   ```

2. **Check Network tab**:
   - Apakah theme CSS files di-request?
   - Status code apa? (200, 403, etc?)

3. **Check server logs**:
   ```bash
   npm run dev
   # Lihat console output untuk errors
   ```

---

## 📁 Files yang Di-Update

| File | Perubahan | Status |
|------|-----------|--------|
| `next.config.ts` | Update CSP headers + add ait.plai.ac.id | ✅ DONE |
| `app/layout.tsx` | Metadata + favicon | ✅ DONE |
| `app/globals.css` | SVG minimal fix | ✅ DONE |
| `wp-content/themes/twentytwentyfive/functions.php` | ADD new functions | ⏳ PERLU DIKERJAKAN |

---

## 📊 Expected Result

**Sebelum**: 
- Hanya SVG besar terlihat
- No styling/CSS loading
- Theme styles dominan

**Sesudah** (setelah LANGKAH 2):
- Frontend Next.js render sempurna
- Dark theme dengan Tailwind CSS
- SVG size normal
- All sections visible (hero, programs, contact, footer)

---

## 🔗 Referensi

- CSP Headers: `next.config.ts` lines 17-33
- WordPress functions: Add to `wp-content/themes/twentytwentyfive/functions.php`
- See `WORDPRESS_CSS_FIX.php` for complete PHP code to copy-paste

---

## 💡 Tips

1. **Cache Clear**: Setelah update functions.php, clear WordPress cache
2. **Browser Cache**: Ctrl+Shift+R untuk hard refresh di browser
3. **Test dengan incognito**: Jika masih ada cache issues

---

**Created**: March 6, 2026  
**Version**: 1.0  
**Status**: ✅ CSP Updated, ⏳ Waiting LANGKAH 2 Implementation
