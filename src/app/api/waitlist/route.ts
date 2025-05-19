import { NextResponse } from 'next/server';
// Removed: import { google } from 'googleapis'; // Lazy load instead

// Your Google Sheets credentials and configuration
// Removed: const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:E'; // Using the new Waitlist sheet

export async function POST(request: Request) {
  try {
    // Lazy load googleapis inside the handler
    const { google } = await import('googleapis');

    // Define SPREADSHEET_ID using lowercase env var name
    const SPREADSHEET_ID = process.env.google_sheet_id; // Changed to lowercase

    console.log('API: Starting waitlist submission...');
    
    // Debug environment variables (without exposing sensitive data)
    console.log('API: Environment check:', {
      hasClientEmail: !!process.env.google_client_email, // Changed to lowercase
      hasPrivateKey: !!process.env.google_private_key, // Changed to lowercase
      hasSheetId: !!process.env.google_sheet_id, // Changed to lowercase
      clientEmailLength: process.env.google_client_email?.length, // Changed to lowercase
      privateKeyLength: process.env.google_private_key?.length, // Changed to lowercase
      sheetIdLength: process.env.google_sheet_id?.length, // Changed to lowercase
      sheetId: process.env.google_sheet_id, // Changed to lowercase
    });

    // Validate environment variables
    if (!process.env.google_client_email || !process.env.google_private_key || !process.env.google_sheet_id) { // Changed to lowercase
      const missingVars = [];
      if (!process.env.google_client_email) missingVars.push('google_client_email'); // Changed to lowercase
      if (!process.env.google_private_key) missingVars.push('google_private_key'); // Changed to lowercase
      if (!process.env.google_sheet_id) missingVars.push('google_sheet_id'); // Changed to lowercase
      
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
        client_email: process.env.google_client_email, // Changed to lowercase
        private_key: process.env.google_private_key, // Changed to lowercase
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
          hasClientEmail: !!process.env.google_client_email, // Changed to lowercase
          hasPrivateKey: !!process.env.google_private_key, // Changed to lowercase
          hasSheetId: !!process.env.google_sheet_id, // Changed to lowercase
          clientEmailLength: process.env.google_client_email?.length, // Changed to lowercase
          privateKeyLength: process.env.google_private_key?.length, // Changed to lowercase
          sheetIdLength: process.env.google_sheet_id?.length, // Changed to lowercase
        }
      },
      { status: 500 }
    );
  }
} 