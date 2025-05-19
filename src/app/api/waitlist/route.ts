import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Initialize the Google Sheets API
const sheets = google.sheets('v4');

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:E'; // Using the new Waitlist sheet

export async function POST(request: Request) {
  try {
    // Validate environment variables
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      console.error('Missing required environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { name, email, phone, reason } = body;

    // Validate required fields
    if (!name || !email || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create credentials object
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    // Create a JWT client using the service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const client = await auth.getClient();

    // Prepare the data for Google Sheets
    const timestamp = new Date().toISOString();
    const values = [[timestamp, name, email, phone || '', reason]];

    // Append the data to Google Sheets
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: WAITLIST_SHEET_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to save to spreadsheet');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing waitlist submission:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 