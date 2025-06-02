import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Use hardcoded webhook secret
    const webhookSecret = '0762580a4f98e57116fa4718745b102cbabef89c5e1d51677e89e8bc6439b9ca';
    
    // Get the base URL from environment variables
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) {
      console.error('API: Missing base URL');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Ensure baseUrl ends with a slash
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    
    // Construct the webhook URL properly
    const webhookUrl = `${normalizedBaseUrl}api/waitlist/webhook?secret=${webhookSecret}`;

    console.log('API: Fetching count from webhook:', webhookUrl);

    // Make authenticated request to the webhook endpoint
    const response = await fetch(webhookUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API: Webhook request failed:', errorData);
      throw new Error(errorData.error || 'Failed to fetch waitlist count');
    }

    const data = await response.json();
    console.log('API: Webhook response:', data);
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