# WordPress + Next.js Integration Setup Guide

## 📋 Ringkasan Integrasi

**Frontend:** Next.js pada `https://ait-webapp.vercel.app`  
**Backend:** WordPress pada `ait.plai.ac.id` (dengan Cloudflare)  
**Metode:** REST API | Embed Method: iframe  
**Status:** ✅ Ready for Setup

---

## 🎯 Pendekatan Solusi

Karena WordPress di-protect oleh Cloudflare dan WPGraphQL terblokir, kami menggunakan:  

1. **WP REST API** - Tersedia public di `/wp-json/wp/v2`
2. **API Proxy Route** - Next.js route (`/api/wordpress/...`) untuk handle CORS
3. **iframe Embedding** - WordPress page menampilkan frontend Next.js  

### Alur Kerja:
```
User browser → ait.plai.ac.id (WordPress)
    ↓
   iframe src="https://ait-webapp.vercel.app"
    ↓
Next.js Frontend App
    ↓
Fetch data → /api/wordpress/posts → Proxy
    ↓
https://ait.plai.ac.id/wp-json/wp/v2/posts
```

---

## 🚀 Step-by-Step Setup

### LANGKAH 1: Persiapan di WordPress 

#### A. Buat Page Template (frontend.php)

**Akses WordPress Theme Files:**
- Via Dashboard: Appearance → Theme File Editor
- Via FTP: Upload ke `/wp-content/themes/[tema-aktif]/`

**Buat file baru:** `frontend.php`

```php
<?php
/*
Template Name: Frontend
Template Post Type: page
Description: Menampilkan frontend Next.js dalam iframe
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title><?php bloginfo('name'); ?> - Training Platform</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
        
        iframe {
            display: block;
            border: none;
            width: 100%;
            height: 100vh;
            background: #0f172a;
        }
        
        /* Fallback untuk browser lama */
        @supports (height: 100dvh) {
            iframe {
                height: 100dvh;
            }
        }
        
        /* Loading state */
        .loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background: #0f172a;
            color: #64748b;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
    </style>
</head>
<body>
    <div class="loading">
        <p>Loading AIT Platform...</p>
    </div>
    
    <iframe 
        id="app-iframe"
        src="https://ait-webapp.vercel.app" 
        title="AIT Training Platform"
        allow="camera; microphone; geolocation; accelerometer; gyroscope; magnetometer"
        loading="lazy"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-top-navigation-by-user-activation"
    ></iframe>
    
    <script>
        // Hide loading teks saat iframe siap
        document.getElementById('app-iframe').onload = function() {
            document.querySelector('.loading').style.display = 'none';
        };
    </script>
</body>
</html>
```

#### B. (Alternatif) Proxy via `functions.php` untuk tema yang dikunci

Jika Anda **tidak bisa membuat file baru di folder tema** karena keterbatasan hak akses,
metode lain yang bekerja dari dalam `functions.php` bisa digunakan. Strategi ini
membiarkan WordPress melakukan `GET` ke URL frontend Vercel setiap kali halaman
WordPress diminta, lalu menampilkan HTML tersebut langsung kepada pengguna. Domain
akan tetap `ait.plai.ac.id` sehingga pengunjung tidak pernah melihat alamat Vercel.

**Langkah:**
1. Buka **Dashboard → Appearance → Theme File Editor**
2. Pilih file `functions.php` dari tema aktif
3. Scroll ke bagian paling bawah dan tambahkan kode berikut:

```php
add_action('template_redirect', function () {
    if (is_admin()) {
        return; // jangan proxy ketika berada di dashboard
    }

    $vercel_url = 'https://ait-webapp.vercel.app'; // ganti sesuai URL Anda
    $request_uri = $_SERVER['REQUEST_URI'];
    $target = $vercel_url . $request_uri;

    $response = wp_remote_get($target);
    if (is_wp_error($response)) {
        return; // biarkan WP normal jika request gagal
    }

    $body = wp_remote_retrieve_body($response);
    echo $body;
    exit;
});
```

**Apa yang terjadi?**
- Ketika user membuka `https://ait.plai.ac.id/blog`, WP melakukan otomatis
  `GET https://ait-webapp.vercel.app/blog` di belakang layar.
- HTML yang diterima dikirim langsung ke browser user sambil domain tetap `ait.plai.ac.id`.
- Routing Next.js tetap berjalan karena path dipertahankan.

**Hal penting:** pastikan frontend Next.js menggunakan **relative URL** untuk
aset (`/ _next/...`), bukan `https://ait-webapp.vercel.app/_next/...`. Untuk
memastikan ini gunakan konfigurasi `assetPrefix: ''` di `next.config.ts` (default)
atau set `NEXT_PUBLIC_ASSET_PREFIX` ke string kosong seperti di `.env.local`.

> Jika CSS atau JavaScript tak muncul, tambahkan `assetPrefix: ''` dan deploy ulang.

Metode ini menggantikan kebutuhan template frontend.php tetapi
bercakupan perilaku serupa tanpa perubahan struktur file tema.

---

Lanjut baca bagian berikutnya untuk cara membuat page/menetapkan homepage seperti biasa.


#### B. Buat Page di WordPress Dashboard

1. Go to **Pages** → **Add New**
2. **Title:** AIT Platform Training (atau nama sesuai keinginan)
3. **URL slug:** home (atau biarkan auto)
4. **Template:** Pilih **Frontend** (template yang baru dibuat)
5. **Content:** Biarkan kosong (tidak perlu)
6. **Visibility:** Public
7. **Publish**

#### C. Set Sebagai Homepage

1. Go to **Settings** → **Reading**
2. Select "A static page" untuk homepage display
3. **Homepage:** Pilih page yang baru dibuat (AIT Platform Training)
4. **Posts page:** Bisa untuk blog (optional)
5. **Save Changes**

---

### LANGKAH 2: Publish di Vercel

```bash
# Login ke Vercel
vercel login

# Deploy ke production
vercel --prod
```

Atau gunakan Git → Vercel automatically deploy saat push ke main branch.

**Verify:** `https://ait-webapp.vercel.app` bisa diakses public

---

### LANGKAH 3: Testing

#### Test 1: Static Page Display
```bash
curl https://ait.plai.ac.id/
# Seharusnya return HTML dengan iframe tag
```

#### Test 2: WordPress REST API Accessible
```bash
curl https://ait.plai.ac.id/wp-json/wp/v2/posts
# Seharusnya return JSON array dengan posts
```

#### Test 3: Frontend iframe Loading
1. Buka browser
2. Go to `https://ait.plai.ac.id/`
3. Seharusnya menampilkan frontend Next.js di dalamnya
4. Open DevTools (F12) → Console
5. Check untuk errors

---

## 💾 Files Structure

```
/workspaces/ait-webapp/
├── lib/
│   ├── wordpress.ts          # ← API utilities untuk fetch WordPress data
│   └── wordpress-setup.md    # ← Dokumentasi ini
├── app/
│   ├── api/
│   │   └── wordpress/
│   │       └── [...slug]/
│   │           └── route.ts  # ← API Proxy route
│   ├── page.tsx              # ← Home page
│   ├── components/
│   │   ├── CourseList.tsx    # ← Dapat menggunakan WordPress data
│   │   └── Navbar.tsx
│   └── layout.tsx
├── .env.local                 # ← Konfigurasi environment
└── package.json
```

---

## 🔗 API Usage Examples

### Fetch Posts dari WordPress

**Server Component:**
```typescript
import { getPosts } from '@/lib/wordpress';

export default async function Page() {
  const posts = await getPosts({ per_page: 10 });
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
          <p>{post.excerpt.rendered}</p>
        </article>
      ))}
    </div>
  );
}
```

### Client Component dengan Loading State:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getPosts, type WPPost } from '@/lib/wordpress';

export function CoursesList() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts({ per_page: 6 })
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title.rendered}</h3>
        </div>
      ))}
    </div>
  );
}
```

### Search Posts:

```typescript
const results = await searchPosts('digital marketing');
```

### Get Posts by Category:

```typescript
const categoryPosts = await getPostsByCategory(5, { per_page: 10 });
```

### Get Categories:

```typescript
const categories = await getCategories({ per_page: 20 });
```

---

## 🛠️ Troubleshooting

### ❌ CORS Error di Browser Console

**Symptom:**
```
Access to XMLHttpRequest at 'https://ait.plai.ac.id/wp-json/wp/v2/posts' 
from origin 'https://ait-webapp.vercel.app' has been blocked by CORS policy
```

**Solution:**
- Ensure `NEXT_PUBLIC_USE_PROXY=true` di `.env.local`
- Update `.env.local` dan redeploy ke Vercel

### ❌ Blank Page di iframe

**Check:**
1. Open DevTools (F12) → Console
2. Lihat apakah ada error message
3. Check Network tab → lihat apakah resources loading

**Solution:**
- Ensure frontend deployed ke Vercel
- Check Vercel deployment URL valid
- Verify Cloudflare firewall tidak block Vercel domain

### ❌ 404 saat akses WordPress page

**Solution:**
- Confirm template `frontend.php` sudah created di theme folder
- Refresh theme cache di WordPress Dashboard
- Re-select template di page edit

### ❌ API Endpoint timeout

**Solution:**
```bash
# Test direct connection
curl -X GET "https://ait.plai.ac.id/wp-json/wp/v2/posts?per_page=1"

# Jika timeout, hubungi server admin
# Kemungkinan: server overload, firewall rules, atau plugin issues
```

---

## 📊 Performance Notes

### Caching Strategy
- API Proxy route cache hasil selama 60 detik
- Gunakan ISR (Incremental Static Regeneration) untuk pages

### Example dengan ISR:
```typescript
export const revalidate = 60; // Revalidate setiap 60 detik

export default async function Page() {
  const posts = await getPosts({ per_page: 10 });
  return <BlogList posts={posts} />;
}
```

---

## 🔒 Security Notes

### Cloudflare WAF Rules

Jika masih ada issues, minta server admin untuk:

1. **Whitelist Vercel domains:**
   - `*.vercel.app`
   - `www.vercel.app`

2. **Allow `/wp-json/` endpoint:**
   - Create Firewall Rule: 
   - Condition: `(cf.threat_score < 50) or (ip.src in {"YOUR_IP"})`
   - Action: Allow

### iframe Sandbox Attributes

File `frontend.php` sudah set dengan sandbox yang tepat:
```html
<iframe 
  sandbox="allow-same-origin allow-scripts allow-popups allow-forms 
           allow-pointer-lock allow-top-navigation allow-top-navigation-by-user-activation"
></iframe>
```

---

## 📝 Checklist Completion

- [ ] Template `frontend.php` dibuat di WordPress theme
- [ ] Page "AIT Platform" dibuat menggunakan template Frontend
- [ ] Homepage setting di-ubah ke page tersebut
- [ ] Next.js app deployed ke Vercel
- [ ] Test homepage: `https://ait.plai.ac.id/` menampilkan frontend
- [ ] Test API: `https://ait.plai.ac.id/wp-json/wp/v2/posts` return JSON
- [ ] Test fetch dari frontend: browser console tidak ada CORS error
- [ ] Deploy latest changes ke Vercel including API proxy route

---

## 📞 Next Steps

1. **Setup Notifications (Optional)**
   - Add Slack/Email webhook untuk post publish notifications

2. **Content Management**
   - Create categories untuk organize courses
   - Setup author profiles untuk instructor

3. **Advanced Features**
   - Custom post types untuk courses, instructors, testimonials
   - Advanced custom fields (ACF) untuk metadata
   - Email notifications integration

4. **Optimization**
   - Setup image optimization plugin di WordPress
   - Configure CDN di Cloudflare

---

**Last Updated:** March 6, 2026  
**Status:** Ready to deploy

