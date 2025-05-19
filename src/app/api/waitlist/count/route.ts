import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.google_sheet_id;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:E';

export async function GET() {
  try {
    console.log('API: Starting waitlist count request');
    
    // Debug environment variables (without exposing sensitive data)
    console.log('API: Environment check:', {
      hasClientEmail: !!process.env.google_client_email,
      hasPrivateKey: !!process.env.google_private_key,
      hasSheetId: !!process.env.google_sheet_id,
      clientEmailLength: process.env.google_client_email?.length,
      privateKeyLength: process.env.google_private_key?.length,
      sheetIdLength: process.env.google_sheet_id?.length,
    });
    
    // Validate environment variables
    if (!process.env.google_client_email || !process.env.google_private_key || !process.env.google_sheet_id) {
      console.error('API: Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    console.log('API: Environment variables validated');

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

    console.log('API: Created auth client');

    // Initialize sheets with the auth client
    const sheets = google.sheets('v4');
    sheets.context._options = { ...sheets.context._options, auth };

    // Get all values from the Waitlist sheet
    console.log('API: Fetching sheet data...');
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: WAITLIST_SHEET_RANGE,
    });

    console.log('API: Sheet data received:', {
      hasValues: !!response.data.values,
      rowCount: response.data.values?.length || 0
    });

    // The first row is headers, so we subtract 1 from the length to get the count
    const count = (response.data.values?.length || 1) - 1;
    console.log('API: Calculated count:', count);

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