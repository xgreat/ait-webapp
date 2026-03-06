# WordPress Integration - Quick Reference

## 📦 Files yang Sudah Siap

| File | Deskripsi |
|------|-----------|
| `lib/wordpress.ts` | API utilities untuk WordPress REST API |
| `app/api/wordpress/[...slug]/route.ts` | API Proxy untuk mengatasi CORS |
| `lib/wordpress-setup.md` | Setup guide lengkap (READ THIS!) |
| `.env.local` | Environment variables sudah dikonfigurasi |

## ⚡ Quick Start

### 1. Upload ke Vercel

```bash
# Jika belum punya Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### 2. Buat Template WordPress

Anda punya dua pilihan:

* **Template file** (`frontend.php`) – cara standar, memerlukan akses file.
* **Proxy via `functions.php`** – jika Anda tidak bisa menambah file, gunakan
  snippet PHP untuk mem-forward ke Vercel.

**Template file (cari/unggah ke wp-content/themes/[theme]/frontend.php):**
```php
<?php
/*
Template Name: Frontend
Template Post Type: page
*/
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * { margin: 0; padding: 0; }
        body, html { width: 100%; height: 100%; overflow: hidden; }
        iframe { display: block; border: none; width: 100%; height: 100vh; }
    </style>
</head>
<body>
    <iframe src="https://ait-webapp.vercel.app" title="Training Platform" allow="camera; microphone; geolocation"></iframe>
</body>
</html>
```

**Proxy alternative (tambahkan ke `functions.php` tema aktif):**
```php
add_action('template_redirect', function () {
    if (is_admin()) return;
    $vercel = 'https://ait-webapp.vercel.app';
    $req = $_SERVER['REQUEST_URI'];
    $res = wp_remote_get($vercel . $req);
    if (is_wp_error($res)) return;
    echo wp_remote_retrieve_body($res);
    exit;
});
```

- Pastikan Next.js menggunakan path relatif (`assetPrefix: ''`) agar
  `/ _next/...` dan asset lain tidak diarahkan ke domain Vercel.

### 3. Create WordPress Page

1. **Pages** → **Add New**
2. Title: `AIT Platform`
3. Template: `Frontend`
4. **Publish**

### 4. Set as Homepage

1. **Settings** → **Reading**
2. Select static page
3. Choose `AIT Platform` sebagai homepage
4. **Save**

### 5. Test

- Open: `https://ait.plai.ac.id/`
- Seharusnya menampilkan Next.js frontend

## 🔌 Menggunakan API di Components

### Server Component

```typescript
import { getPosts } from '@/lib/wordpress';

export default async function BlogPage() {
  const posts = await getPosts({ per_page: 10 });
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title.rendered}</h2>
        </article>
      ))}
    </div>
  );
}
```

### Client Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getPosts, type WPPost } from '@/lib/wordpress';

export default function Posts() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  
  useEffect(() => {
    getPosts({ per_page: 6 }).then(setPosts);
  }, []);
  
  return <>{posts.map(post => <div key={post.id}>{post.title.rendered}</div>)}</>;
}
```

## 📚 Available Functions

```typescript
// Posts
getPosts(options?)              // Get all posts
getPost(id)                     // Get single post
searchPosts(query, options?)    // Search posts
getFeaturedPosts(options?)      // Get sticky posts
getPostsByCategory(id, options?) // Get posts by category

// Categories
getCategories(options?)         // Get all categories
getCategory(id)                 // Get single category

// Pages
getPages(options?)              // Get all pages
getPage(id)                     // Get single page

// Custom
getCustomPosts(type, options?)  // Get custom post type
```

## ⚙️ Environment Variables

File: `.env.local`

```env
NEXT_PUBLIC_WP_API_URL=https://ait.plai.ac.id/wp-json/wp/v2
NEXT_PUBLIC_USE_PROXY=true
NEXT_PUBLIC_APP_URL=https://ait-webapp.vercel.app
```

## 🐛 Common Issues

| Error | Solution |
|-------|----------|
| CORS Error | Ensure `NEXT_PUBLIC_USE_PROXY=true` |
| Blank page di iframe | Check Vercel deployment is public |
| 404 di WordPress page | Refresh theme cache, re-select template |
| API timeout | Test connection: `curl https://ait.plai.ac.id/wp-json/wp/v2/posts` |

## 📖 Full Documentation

Lihat: **[lib/wordpress-setup.md](./wordpress-setup.md)** untuk setup guide lengkap

## 🔗 Useful Links

- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [Next.js Data Fetching](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)

---

**Status:** ✅ Ready to Deploy  
**Last Updated:** March 6, 2026
