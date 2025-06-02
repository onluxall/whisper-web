import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the webhook secret from environment variables
    const webhookSecret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error('API: Missing webhook secret');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Ensure base URL is properly formatted without quotes
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/['"]/g, '');
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not configured');
    }

    // Make authenticated request to the webhook endpoint
    const webhookUrl = new URL('/api/waitlist/webhook', baseUrl);
    webhookUrl.searchParams.set('secret', webhookSecret);

    const response = await fetch(webhookUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch waitlist count');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API: Error proxying waitlist count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get waitlist count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 