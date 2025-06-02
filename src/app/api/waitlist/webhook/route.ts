import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.google_sheet_id;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:A';
const WEBHOOK_SECRET = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get('x-webhook-secret');
    if (!authHeader || authHeader !== WEBHOOK_SECRET) {
      console.error('API: Invalid webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Validate environment variables
    if (!process.env.google_client_email || !process.env.google_private_key || !process.env.google_sheet_id) {
      console.error('API: Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
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

    return NextResponse.json({ count });
  } catch (error) {
    console.error('API: Error processing webhook:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process webhook',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Add a GET endpoint that also requires authentication
export async function GET(request: Request) {
  try {
    // Verify webhook secret from query parameter
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    if (!secret || secret !== WEBHOOK_SECRET) {
      console.error('API: Invalid webhook secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Rest of the logic is the same as POST
    if (!process.env.google_client_email || !process.env.google_private_key || !process.env.google_sheet_id) {
      console.error('API: Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const credentials = {
      client_email: process.env.google_client_email,
      private_key: process.env.google_private_key,
    };

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets('v4');
    sheets.context._options = { ...sheets.context._options, auth };

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: WAITLIST_SHEET_RANGE,
    });

    const count = (response.data.values?.length || 1) - 1;

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