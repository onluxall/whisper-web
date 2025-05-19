import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Your Google Sheets credentials and configuration
// Removed: const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:E'; // Using the new Waitlist sheet

export async function POST(request: Request) {
  try {
    // Define SPREADSHEET_ID inside the handler
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

    console.log('API: Starting waitlist submission...');
    
    // Debug environment variables (without exposing sensitive data)
    console.log('API: Environment check:', {
      hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      clientEmailLength: process.env.GOOGLE_CLIENT_EMAIL?.length,
      privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length,
      sheetIdLength: process.env.GOOGLE_SHEET_ID?.length,
      sheetId: process.env.GOOGLE_SHEET_ID, // Log the actual sheet ID to verify it's correct
    });

    // Validate environment variables
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
      const missingVars = [];
      if (!process.env.GOOGLE_CLIENT_EMAIL) missingVars.push('GOOGLE_CLIENT_EMAIL');
      if (!process.env.GOOGLE_PRIVATE_KEY) missingVars.push('GOOGLE_PRIVATE_KEY');
      if (!process.env.GOOGLE_SHEET_ID) missingVars.push('GOOGLE_SHEET_ID');
      
      console.error('Missing required environment variables:', missingVars);
      return NextResponse.json(
        { error: `Server configuration error: Missing ${missingVars.join(', ')}` },
        { status: 500 }
      );
    }

    // Parse the request body and log it for debugging
    const body = await request.json();
    console.log("Waitlist POST request body:", body);
    const { name, email, phone, reason } = body;

    // Validate required fields
    if (!name || !email || !reason) {
      console.error("Missing required fields:", { name, email, reason });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    try {
      // Create credentials object inside the handler
      const credentials = {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY,
      };

      console.log('API: Created credentials object with email:', credentials.client_email);

      // Create a JWT client using the service account credentials
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      });

      console.log('API: Created auth client successfully');

      // Initialize sheets with the auth client
      const sheets = google.sheets('v4');
      sheets.context._options = { ...sheets.context._options, auth };

      console.log('API: Initialized sheets client successfully');

      // Prepare the data for Google Sheets
      const timestamp = new Date().toISOString();
      const values = [[timestamp, name, email, phone || '', reason]];

      console.log('API: Attempting to append data to sheet:', {
        spreadsheetId: SPREADSHEET_ID,
        range: WAITLIST_SHEET_RANGE,
        rowCount: values.length,
        timestamp,
        name,
        email,
        hasPhone: !!phone,
        reason
      });

      // Append the data to Google Sheets
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: WAITLIST_SHEET_RANGE,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });

      console.log('API: Sheets append response:', {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data
      });

      if (!response.data) {
        console.error("Google Sheets append error:", response);
        throw new Error("Failed to save to spreadsheet");
      }

      return NextResponse.json({ success: true });
    } catch (sheetsError: unknown) {
      console.error("Google Sheets API error:", {
        message: sheetsError instanceof Error ? sheetsError.message : 'Unknown error',
        stack: sheetsError instanceof Error ? sheetsError.stack : 'N/A',
        response: (sheetsError as any)?.response?.data || 'No response data',
        code: (sheetsError as any)?.code,
        status: (sheetsError as any)?.status,
        errors: (sheetsError as any)?.errors
      });
      throw sheetsError;
    }
  } catch (error: unknown) {
    console.error("Error processing waitlist submission:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'N/A',
      response: (error as any)?.response?.data || 'No response data',
      code: (error as any)?.code,
      status: (error as any)?.status,
      errors: (error as any)?.errors
    });
    return NextResponse.json(
      { 
        error: 'Failed to process submission',
        details: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
          hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
          hasSheetId: !!process.env.GOOGLE_SHEET_ID,
          clientEmailLength: process.env.GOOGLE_CLIENT_EMAIL?.length,
          privateKeyLength: process.env.GOOGLE_PRIVATE_KEY?.length,
          sheetIdLength: process.env.GOOGLE_SHEET_ID?.length,
        }
      },
      { status: 500 }
    );
  }
} 