import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * assetPrefix ensures generated URLs for static assets
   * are relative, which is important when WordPress proxies
   * the HTML. If you host the frontend on a different domain
   * (e.g. Vercel) but render it under ait.plai.ac.id via PHP
   * proxy, using relative paths avoids requests to the Vercel
   * domain for _next/* assets.
   */
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX || '',

  // Security Headers for OWASP Top 10 Protection
  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          // A01:2021-Broken Access Control - CSP Header
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https://ait.plai.ac.id",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel.app *.vercel.com cdn.vercel.com https://ait.plai.ac.id",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com https://ait.plai.ac.id *.wp.com",
              "font-src 'self' fonts.gstatic.com https://ait.plai.ac.id",
              "img-src 'self' data: https: *.vercel.app *.wp.com https://ait.plai.ac.id",
              "media-src 'self' https://ait.plai.ac.id *.wp.com",
              "connect-src 'self' *.vercel.app *.wp.com https://ait.plai.ac.id",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },

          // A05:2021-Security Misconfiguration - Security Headers
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: [
              'camera=()',
              'microphone=()',
              'geolocation=()',
              'interest-cohort=()',
              'magnetometer=()',
              'gyroscope=()',
              'accelerometer=()',
              'payment=()'
            ].join(', ')
          },

          // A02:2021-Cryptographic Failures - HTTPS Enforcement
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          },

          // A03:2021-Injection - Additional XSS Protection
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'same-origin'
          },

          // A06:2021-Vulnerable Components - Remove Server Info
          {
            key: 'X-Powered-By',
            value: '' // Remove server identification
          }
        ],
      },
    ];
  },

  // Additional security configurations
  poweredByHeader: false, // Remove X-Powered-By header

  // Experimental features for security
  experimental: {
    // Enable strict CSP compliance
    optimizeCss: true,
  },

  // Image optimization with security
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ait.plai.ac.id',
      },
      {
        protocol: 'https',
        hostname: 'vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'vercel.com',
      },
    ],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
