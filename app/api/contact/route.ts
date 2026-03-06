import { NextRequest, NextResponse } from 'next/server';
import { sanitizeEmail, sanitizeHtml, apiRateLimiter } from '../../../lib/security';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') ||
                    request.headers.get('x-real-ip') ||
                    'unknown';

    if (!apiRateLimiter.isAllowed(`contact-${clientIP}`)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(name);
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedCompany = company ? sanitizeHtml(company) : '';
    const sanitizedMessage = sanitizeHtml(message);

    // Validate sanitized inputs
    if (!sanitizedName || sanitizedName.length < 2 || sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'Invalid name' },
        { status: 400 }
      );
    }

    if (!sanitizedEmail) {
      return NextResponse.json(
        { error: 'Invalid email' },
        { status: 400 }
      );
    }

    if (!sanitizedMessage || sanitizedMessage.length < 10 || sanitizedMessage.length > 1000) {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    // Here you would typically send the email to ait@plai.ac.id
    // For now, we'll just log it and return success
    console.log('Contact form submission (send to ait@plai.ac.id):', {
      name: sanitizedName,
      email: sanitizedEmail,
      company: sanitizedCompany,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      ip: clientIP
    });

    // In production, you might want to:
    // 1. Send email to ait@plai.ac.id using a service like SendGrid, Mailgun, etc.
    // 2. Save to database
    // 3. Send confirmation email to user

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Only allow POST requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}