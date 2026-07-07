import { NextRequest, NextResponse } from 'next/server';

/**
 * Brightwheel OAuth Callback Handler
 * Processes OAuth authorization code and stores access token
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json(
      { error: 'Missing authorization code' },
      { status: 400 }
    );
  }

  try {
    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://schools.mybrightwheel.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/brightwheel/callback`,
        client_id: process.env.BRIGHTWHEEL_CLIENT_ID,
        client_secret: process.env.BRIGHTWHEEL_CLIENT_SECRET
      })
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code');
    }

    const { access_token, refresh_token, expires_in } = await tokenResponse.json();

    // In production, store tokens securely in database
    // For now, we'll redirect with token in secure httpOnly cookie
    const response = NextResponse.redirect(
      new URL('/dashboard/career-path', request.url)
    );

    // Set secure httpOnly cookie with access token
    response.cookies.set('brightwheel_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expires_in
    });

    if (refresh_token) {
      response.cookies.set('brightwheel_refresh_token', refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 // 30 days
      });
    }

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json(
      { error: 'Failed to complete OAuth flow' },
      { status: 500 }
    );
  }
}
