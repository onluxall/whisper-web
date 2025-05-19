import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_RANGE = 'Stats!A2:C2'; // Updated range for Development Progress and Target Launch

export async function GET() {
  try {
    // Debug: Log all environment variables (without sensitive data)
    console.log('Environment check:', {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      clientEmailLength: process.env.GOOGLE_CLIENT_EMAIL?.length,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length,
      sheetIdLength: process.env.GOOGLE_SHEET_ID?.length,
    });

    // Validate environment variables
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      return NextResponse.json(
        { 
          error: 'Missing required environment variables',
          details: {
            hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
            hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
            hasSheetId: !!process.env.GOOGLE_SHEET_ID,
          }
        },
        { status: 500 }
      );
    }

    // Create credentials object with minimal required fields
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    };

    // Create a JWT client using the service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const client = await auth.getClient();
    const sheets = google.sheets('v4');

    // Fetch the data from Google Sheets
    console.log('Fetching data from range:', SHEET_RANGE);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: SHEET_RANGE,
      auth: client as any,
    });

    const rows = response.data.values;
    console.log('Raw sheet data:', rows);

    if (!rows || rows.length === 0) {
      console.log('No data found in the spreadsheet');
      return NextResponse.json(
        { error: 'No data found in the spreadsheet' },
        { status: 404 }
      );
    }

    // Assuming the columns are: Timestamp, Development Progress, Target Launch
    const [timestamp, developmentProgress, targetLaunch] = rows[0];

    console.log('Processed data:', {
      developmentProgress,
      targetLaunch,
      timestamp
    });

    return NextResponse.json({
      developmentProgress,
      targetLaunch,
      timestamp
    });
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    // Add more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to fetch sheet data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
          hasSheetId: !!process.env.GOOGLE_SHEET_ID,
        }
      },
      { status: 500 }
    );
  }
} 