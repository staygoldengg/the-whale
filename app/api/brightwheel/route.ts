import { NextRequest, NextResponse } from 'next/server';

/**
 * Brightwheel OAuth Integration Endpoint
 * Handles authentication and data syncing with Brightwheel
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'auth') {
    // Redirect to Brightwheel OAuth
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/brightwheel/callback`;
    const clientId = process.env.BRIGHTWHEEL_CLIENT_ID;

    const brightwheelAuthUrl = new URL('https://schools.mybrightwheel.com/oauth/authorize');
    brightwheelAuthUrl.searchParams.set('client_id', clientId || '');
    brightwheelAuthUrl.searchParams.set('redirect_uri', redirectUri);
    brightwheelAuthUrl.searchParams.set('response_type', 'code');
    brightwheelAuthUrl.searchParams.set('scope', 'training_read certifications_read');

    return NextResponse.redirect(brightwheelAuthUrl.toString());
  }

  if (action === 'sync') {
    // Sync data from Brightwheel
    const userId = searchParams.get('userId');
    const accessToken = searchParams.get('token');

    if (!userId || !accessToken) {
      return NextResponse.json(
        { error: 'Missing userId or token' },
        { status: 400 }
      );
    }

    try {
      // Fetch courses from Brightwheel Training API
      const coursesResponse = await fetch('https://schools.mybrightwheel.com/api/v1/training/courses', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!coursesResponse.ok) {
        throw new Error('Failed to fetch Brightwheel courses');
      }

      const coursesData = await coursesResponse.json();

      // Fetch certifications from Professional Development API
      const certificationsResponse = await fetch('https://professionaldevelopment.mybrightwheel.com/api/v1/certifications', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      const certificationsData = certificationsResponse.ok 
        ? await certificationsResponse.json() 
        : { certifications: [] };

      // Return synced data
      return NextResponse.json({
        success: true,
        courses: coursesData.courses || [],
        certifications: certificationsData.certifications || [],
        syncedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error syncing Brightwheel data:', error);
      return NextResponse.json(
        { error: 'Failed to sync Brightwheel data' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: 'Invalid action' },
    { status: 400 }
  );
}
