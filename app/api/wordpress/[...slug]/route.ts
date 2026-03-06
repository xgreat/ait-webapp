/**
 * API Proxy Route untuk WordPress REST API
 * Mengatasi kemungkinan CORS issues dari Cloudflare
 * 
 * Usage:
 * GET /api/wordpress/posts
 * GET /api/wordpress/posts/1
 * GET /api/wordpress/categories
 * GET /api/wordpress/pages
 */

import { NextRequest, NextResponse } from 'next/server';

const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://ait.plai.ac.id/wp-json/wp/v2';

export async function GET(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  
  // Extract endpoint dari URL
  // /api/wordpress/posts?per_page=10 -> /posts?per_page=10
  const endpoint = pathname.replace('/api/wordpress', '');
  
  // Build query string
  const queryString = searchParams.toString();
  const url = `${WP_API_URL}${endpoint}${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
        // 'Authorization': `Bearer ${process.env.WP_API_TOKEN}`,
      },
      // Add cache for better performance
      next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `WordPress API Error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Add security and CORS headers
    return NextResponse.json(data, {
      headers: {
        // CORS headers
        'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
          ? 'https://ait.plai.ac.id'
          : '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',

        // Security headers
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',

        // Cache headers
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error(`Error proxying to ${url}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch from WordPress API' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      // CORS headers
      'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production'
        ? 'https://ait.plai.ac.id'
        : '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400',

      // Security headers
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  });
}
