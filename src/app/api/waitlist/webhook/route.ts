import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.google_sheet_id;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:A';
const WEBHOOK_SECRET = '0762580a4f98e57116fa4718745b102cbabef89c5e1d51677e89e8bc6439b9ca';

// Helper function to verify webhook secret
function verifyWebhookSecret(request: Request): boolean {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  return secret === WEBHOOK_SECRET;
}

// Helper function to get waitlist count
async function getWaitlistCount() {
  // Validate environment variables
  if (!process.env.google_client_email || !process.env.google_private_key || !process.env.google_sheet_id) {
    throw new Error('Missing required environment variables');
  }

  // Create credentials object
  const credentials = {
    client_email: process.env.google_client_email,
    private_key: process.env.google_private_key,
  };

  // Create a JWT client using the service account credentials
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  // Initialize sheets with the auth client
  const sheets = google.sheets('v4');
  sheets.context._options = { ...sheets.context._options, auth };

  // Get all values from the Waitlist sheet (only column A)
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: WAITLIST_SHEET_RANGE,
  });

  // The first row is headers, so we subtract 1 from the length to get the count
  const count = (response.data.values?.length || 1) - 1;
  return count;
}

export async function GET(request: Request) {
  try {
    // Verify webhook secret
    if (!verifyWebhookSecret(request)) {
      console.error('API: Invalid webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error('API: Error getting waitlist count:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get waitlist count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 