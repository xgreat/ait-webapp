/**
 * Updated WordPress utilities dengan support API Proxy
 * Bisa fetch langsung dari WordPress atau via API Proxy
 */

const PROXY_API_URL = process.env.NEXT_PUBLIC_WP_PROXY_URL || '/api/wordpress';
const DIRECT_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://ait.plai.ac.id/wp-json/wp/v2';

// Use proxy by default untuk menghindari CORS issues
const API_BASE = process.env.NEXT_PUBLIC_USE_PROXY !== 'false' ? PROXY_API_URL : DIRECT_API_URL;

/**
 * Generic fetch function untuk WordPress API
 * Automatically uses proxy untuk client-side requests
 */
async function wpFetch(endpoint: string, options: RequestInit = {}) {
  // Di server component, gunakan DIRECT_API_URL
  // Di client component, gunakan PROXY_API_URL
  const baseUrl = typeof window !== 'undefined' ? PROXY_API_URL : DIRECT_API_URL;
  const url = `${baseUrl}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`WordPress API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error);
    throw error;
  }
}

/**
 * Fetch semua posts/articles dengan embed media
 */
export async function getPosts(params?: {
  per_page?: number;
  page?: number;
  search?: string;
  categories?: string;
  categories_exclude?: string;
  orderby?: 'date' | 'title' | 'relevance';
  order?: 'asc' | 'desc';
}) {
  const queryParams = new URLSearchParams({
    _embed: 'true', // Include featured images
  });
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.categories) queryParams.append('categories', params.categories);
  if (params?.categories_exclude) queryParams.append('categories_exclude', params.categories_exclude);
  if (params?.orderby) queryParams.append('orderby', params.orderby);
  if (params?.order) queryParams.append('order', params.order);
  
  return wpFetch(`/posts?${queryParams.toString()}`);
}

/**
 * Fetch single post by ID
 */
export async function getPost(id: number) {
  return wpFetch(`/posts/${id}?_embed=true`);
}

/**
 * Fetch semua categories
 */
export async function getCategories(params?: { 
  per_page?: number;
  order?: 'asc' | 'desc';
  orderby?: 'name' | 'count';
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.order) queryParams.append('order', params.order);
  if (params?.orderby) queryParams.append('orderby', params.orderby);
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return wpFetch(`/categories${query}`);
}

/**
 * Fetch single category
 */
export async function getCategory(id: number) {
  return wpFetch(`/categories/${id}`);
}

/**
 * Fetch pages
 */
export async function getPages(params?: {
  per_page?: number;
  page?: number;
  search?: string;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.search) queryParams.append('search', params.search);
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return wpFetch(`/pages${query}`);
}

/**
 * Fetch single page
 */
export async function getPage(id: string | number) {
  return wpFetch(`/pages/${id}?_embed=true`);
}

/**
 * Fetch custom post type (jika ada)
 */
export async function getCustomPosts(postType: string, params?: {
  per_page?: number;
  page?: number;
}) {
  const queryParams = new URLSearchParams();
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  
  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  return wpFetch(`/${postType}${query}`);
}

/**
 * Search posts
 */
export async function searchPosts(query: string, params?: { per_page?: number }) {
  const searchParams = new URLSearchParams({
    search: query,
    _embed: 'true',
  });
  
  if (params?.per_page) searchParams.append('per_page', params.per_page.toString());
  
  return wpFetch(`/posts?${searchParams.toString()}`);
}

/**
 * Get featured posts (sticky posts)
 */
export async function getFeaturedPosts(params?: { per_page?: number }) {
  const queryParams = new URLSearchParams({
    sticky: 'true',
    _embed: 'true',
  });
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  
  return wpFetch(`/posts?${queryParams.toString()}`);
}

/**
 * Get posts by category ID
 */
export async function getPostsByCategory(categoryId: number, params?: { per_page?: number; page?: number }) {
  const queryParams = new URLSearchParams({
    categories: categoryId.toString(),
    _embed: 'true',
  });
  
  if (params?.per_page) queryParams.append('per_page', params.per_page.toString());
  if (params?.page) queryParams.append('page', params.page.toString());
  
  return wpFetch(`/posts?${queryParams.toString()}`);
}

export interface WPPost {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  comment_status: string;
  ping_status: string;
  sticky: boolean;
  template: string;
  format: string;
  meta: Record<string, unknown>;
  categories: number[];
  tags: number[];
  [key: string]: unknown;
}

export interface WPCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent: number;
  meta: Record<string, unknown>;
  _links: Record<string, unknown>;
}

export interface WPPage {
  id: number;
  date: string;
  date_gmt: string;
  guid: { rendered: string };
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  parent: number;
  menu_order: number;
  comment_status: string;
  ping_status: string;
  template: string;
  meta: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WPMedia {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: { rendered: string };
  author: number;
  alt_text: string;
  description: { rendered: string };
  caption: { rendered: string };
  media_type: string;
  mime_type: string;
  media_details: {
    width: number;
    height: number;
    sizes: Record<string, any>;
  };
  source_url: string;
  [key: string]: unknown;
}
