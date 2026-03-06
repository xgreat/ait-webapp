# ✅ WordPress Integration - Step-by-Step Checklist

## 📋 FASE 1: PERSIAPAN (Next.js Frontend)

### Step 1.1: Verify Files sudah Ada
- [x] `/lib/wordpress.ts` - Utility functions
- [x] `/app/api/wordpress/[...slug]/route.ts` - API Proxy
- [x] `/lib/wordpress-setup.md` - Setup guide lengkap 
- [x] `/WORDPRESS_INTEGRATION.md` - Quick reference
- [x] `/.env.local` - Environment variables

**Action:** Tidak perlu, sudah siap! ✓

---

### Step 1.2: Build & Test Locally (Optional)

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test API Proxy
curl http://localhost:3000/api/wordpress/posts

# Seharusnya return JSON dari WordPress
```

**Expected Result:** 
```json
[
  { "id": 1, "title": { "rendered": "..." }, ... },
  { "id": 2, "title": { "rendered": "..." }, ... }
]
```

**Status:** ⏳ Do this if you want to test locally

---

## 📋 FASE 2: DEPLOYMENT KE VERCEL

### Step 2.1: Push Code ke GitHub
```bash
cd /workspaces/ait-webapp

git add .
git commit -m "feat: WordPress integration with API proxy\n\n- Add WP REST API utilities\n- Create API proxy route\n- Add setup documentation"
git push origin main
```

### Step 2.2: Deploy ke Vercel

**Option A: Via GitHub (Recommended)**
1. Push ke GitHub (done in Step 2.1)
2. Go to https://vercel.com
3. Connect GitHub repo
4. Vercel akan auto-deploy saat push ke main

**Option B: Manual Deploy**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to production
vercel --prod
```

### Step 2.3: Verify Deployment
```bash
# Test API endpoint via Vercel
curl https://ait-webapp.vercel.app/api/wordpress/posts

# Seharusnya return JSON
```

**Status:** ⏳ Must finish before Step 3

---

## 📋 FASE 3: WORDPRESS SETUP

### Step 3.1: Buka WordPress Dashboard
- Go to: `https://ait.plai.ac.id/wp-admin`
- Login dengan credentials Anda

### Step 3.2: Buat Template `frontend.php`

**Option A: Via WordPress Theme Editor (Easier)**
1. Dashboard → Appearance → Theme File Editor
2. Click "Create new file"
3. Name: `frontend.php`
4. Paste code di bawah

**Option B: Via FTP/SFTP**
1. Connect via FTP ke server
2. Navigate to: `/wp-content/themes/[theme-name]/`
3. Create file: `frontend.php`
4. Upload kode di bawah

**Option C: Kalau tidak punya akses folder tema**
- Buka Dashboard → Appearance → Theme File Editor
- Pilih `functions.php` untuk tema aktif
- Tambahkan kode proxy berikut di paling bawah:

```php
add_action('template_redirect', function () {
    if (is_admin()) return; // jangan ganggu dashboard
    $vercel_url = 'https://ait-webapp.vercel.app'; // ganti sesuai domain
    $request_uri = $_SERVER['REQUEST_URI'];
    $response = wp_remote_get($vercel_url . $request_uri);
    if (is_wp_error($response)) return;
    echo wp_remote_retrieve_body($response);
    exit;
});
```

- Setelah disimpan, WordPress akan otomatis mem‑proxy setiap permintaan ke
  frontend Vercel; user tetap melihat `ait.plai.ac.id`.
- Pastikan aplikasi Next.js menggunakan path relatif untuk aset (lihat catatan
  assetPrefix di `next.config.ts`).


**Code untuk `frontend.php`:**

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
        
        @supports (height: 100dvh) {
            iframe {
                height: 100dvh;
            }
        }
    </style>
</head>
<body>
    <iframe 
        src="https://ait-webapp.vercel.app" 
        title="AIT Training Platform"
        allow="camera; microphone; geolocation; accelerometer; gyroscope; magnetometer"
        loading="lazy"
    ></iframe>
</body>
</html>
```

**Status:** ⏳ Create this file

---

### Step 3.3: Buat Page untuk Frontend

1. Go to **Pages** → **Add New**
2. **Title:** `AIT Platform Training` (atau nama lain)
3. **Content:** Biarkan kosong (tidak perlu diisi)
4. Scroll down ke "Template"
5. **Select Template:** `Frontend` (yang baru dibuat)
6. **URL Slug:** `home` atau biarkan auto
7. Click **Publish**

**Screenshot guide:**
```
┌─ Pages
│  └─ Add New
│     ├─ Title: AIT Platform Training
│     ├─ Content: [empty]
│     ├─ Template dropdown: Select "Frontend"
│     └─ Publish button →
```

**Status:** ⏳ Create this page

---

### Step 3.4: Set Sebagai Homepage

1. Go to **Settings** → **Reading**
2. Under "Your homepage displays"
3. Select **A static page**
4. Homepage: `AIT Platform Training` (page yang baru dibuat)
5. Posts page: Biarkan kosong atau pilih page lain
6. Click **Save Changes**

**Visual:**
```
[SETTINGS] → [READING]
  Your homepage displays:
  ⦿ Your latest posts
  ⦿ A static page
      Homepage: [AIT Platform Training ▼]
      Posts page: [           ▼]
  
  [Save Changes]
```

**Status:** ⏳ Do this after step 3.3

---

## 📋 FASE 4: TESTING

### Step 4.1: Test Homepage (Most Important!)

1. Open browser
2. Go to: `https://ait.plai.ac.id/`
3. **Expected:** Next.js frontend appears dalam iframe

**Checklist:**
- [ ] Page loads (tidak 404)
- [ ] Next.js app visible di page
- [ ] Responsive (works on mobile)
- [ ] No blank page

### Step 4.2: Check Browser Console

1. Press `F12` (atau Right-click → Inspect)
2. Go to **Console** tab
3. Look for error messages

**Expected:**
- ✓ No CORS errors
- ✓ No 404 errors
- ✓ Only warnings maybe

**If CORS Error:**
```
Access to XMLHttpRequest at 'https://ait.plai.ac.id/wp-json/wp/v2/posts' 
from origin 'https://ait-webapp.vercel.app' has been blocked by CORS policy
```

**Fix:**
- Ensure Vercel deployed 
- Check `.env.local` has `NEXT_PUBLIC_USE_PROXY=true`
- Restart dev server if testing locally

### Step 4.3: Test API Directly

```bash
# In terminal, test if WP REST API accessible
curl https://ait.plai.ac.id/wp-json/wp/v2/posts

# Expected: JSON response with posts
```

---

## 📋 FASE 5: INTEGRATION (Optional, Can Do Later)

Jika ingin fetch WordPress data di component:

### Step 5.1: Buat Example Component

File: `app/components/LatestPosts.tsx`

```typescript
import { getPosts } from '@/lib/wordpress';

export default async function LatestPosts() {
  const posts = await getPosts({ per_page: 3 });

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-6">Latest Courses</h2>
      <div className="grid gap-4">
        {posts.map(post => (
          <article key={post.id} className="border rounded p-4">
            <h3 className="text-lg font-bold">{post.title.rendered}</h3>
            <p className="text-sm text-gray-600">{post.excerpt.rendered.replace(/<[^>]*>/g, '')}</p>
            <a href={post.link} className="text-blue-600 hover:underline">Read More →</a>
          </article>
        ))}
      </div>
    </section>
  );
}
```

### Step 5.2: Use di Page

File: `app/page.tsx`

```typescript
import Navbar from './components/Navbar';
import LatestPosts from './components/LatestPosts';

export default function Home() {
  return (
    <main>
      <Navbar />
      <section>
        <h1>Welcome to AIT</h1>
        <p>Training Platform</p>
      </section>
      <LatestPosts />  {/* Add this */}
    </main>
  );
}
```

**Status:** ⏳ Do this AFTER testing Phase 4

---

## ✅ COMPLETION CHECKLIST

### Before Testing
- [ ] Files created in workspace
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Vercel deployment shows "Ready"

### WordPress Setup
- [ ] Template `frontend.php` created in theme
- [ ] Page "AIT Platform Training" created
- [ ] Template selected for the page
- [ ] Page published successfully
- [ ] Homepage settings updated
- [ ] Settings saved

### Testing
- [ ] Visit `https://ait.plai.ac.id/` loads
- [ ] Next.js frontend visible in iframe
- [ ] No errors in browser console
- [ ] WP REST API accessible (`curl` test)
- [ ] Mobile responsive

### Optional: Integration
- [ ] Created example component pulling WordPress data
- [ ] Added to page and tested
- [ ] No errors when data fetched

---

## 🎯 EXPECTED RESULTS

### After Step 3.4 (Homepage Set)
```
❌ ait.plai.ac.id/
↓
✅ Shows Next.js frontend in iframe
✅ Navbar visible
✅ Hero section visible
✅ All styling intact
✅ Links clickable
```

### Browser Console Should Show
```
✓ No errors
✓ No CORS errors
✓ Possible: Some warnings from third-party scripts (OK)
```

### API Test Should Return
```bash
$ curl https://ait.plai.ac.id/wp-json/wp/v2/posts
[
  {
    "id": 1,
    "title": { "rendered": "..." },
    ...
  }
]
```

---

## 🆘 TROUBLESHOOTING

### Issue: Blank Page at ait.plai.ac.id

**Possible Causes:**
1. Template file not created
2. Template not selected on page
3. Homepage setting not configured
4. Theme cache not refreshed

**Solutions:**
```bash
# Option 1: Reload theme cache
# Dashboard → Appearance → Theme File Editor
# (This reloads cache automatically)

# Option 2: Re-select template
# Page edit → Scroll down → Re-select "Frontend" template → Update

# Option 3: Check file exists
# Via FTP: /wp-content/themes/[theme]/frontend.php should exist
```

### Issue: CORS Error in Console

**Error Example:**
```
Access to XMLHttpRequest at 'https://ait.plai.ac.id/wp-json/wp/v2/posts' 
from origin 'https://ait-webapp.vercel.app' 
has been blocked by CORS policy
```

**Solution:**
1. Verify Vercel deployed: `https://ait-webapp.vercel.app` accessible
2. Check `.env.local` has `NEXT_PUBLIC_USE_PROXY=true`
3. Redeploy to Vercel: `vercel --prod`

### Issue: iframe Shows Blank/Default Page

**Cause:** Vercel deployment not successful

**Check:**
```bash
# Test if Vercel app loads
curl https://ait-webapp.vercel.app

# Expected: HTML response (not error)
```

**Fix:**
```bash
# Redeploy
vercel --prod

# Or check Vercel dashboard for errors
```

### Issue: 404 Page Not Found on Slugs

**Cause:** Wrong template selected or page not published

**Fix:**
1. Go to WordPress Pages
2. Select the page
3. Confirm Template = "Frontend"
4. Confirm Status = "Publish"
5. Save

---

## 📞 NEXT STEPS After Success

After everything working, you can:

1. **Add WordPress Content**
   - Create categories in WordPress
   - Add posts/courses through WordPress admin

2. **Integrate into Components**
   - Use `getPosts()` to fetch data
   - Display in CourseList, BlogList, etc.
   - See WORDPRESS_INTEGRATION.md for examples

3. **Optimize Performance**
   - Setup ISR (Incremental Static Regeneration)
   - Configure caching headers
   - Optimize images in WordPress

4. **Add Features**
   - Search functionality
   - Filtering by category
   - Pagination
   - Author profiles

---

## 📚 Reference Documents

| Document | Purpose |
|----------|---------|
| `SETUP_SUMMARY.md` | Architecture & implementation summary |
| `WORDPRESS_INTEGRATION.md` | Quick reference & code snippets |
| `lib/wordpress-setup.md` | **← READ THIS for detailed setup** |
| `lib/wordpress.ts` | API functions documentation |

---

## 🎉 You're Ready!

**Time to Complete:** ~30 minutes

**Difficulty:** ⭐⭐ Easy

**Questions?** Check [lib/wordpress-setup.md](./lib/wordpress-setup.md)

---

**Created:** March 6, 2026  
**Status:** Ready to follow checklist  
**Next:** Start with FASE 1, Step 1.2 (if testing locally) or FASE 2 (if deploying directly)
