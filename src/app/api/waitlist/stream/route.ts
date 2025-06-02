import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.google_sheet_id;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:A';

// Store active connections
const clients = new Set<ReadableStreamDefaultController>();

// Function to broadcast count to all connected clients
function broadcastCount(count: number) {
  const message = `data: ${JSON.stringify({ count })}\n\n`;
  clients.forEach(client => {
    try {
      client.enqueue(new TextEncoder().encode(message));
    } catch (error) {
      console.error('Error sending to client:', error);
      clients.delete(client);
    }
  });
}

// Function to fetch current count
async function getCurrentCount(): Promise<number> {
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

  return (response.data.values?.length || 1) - 1;
}

export async function GET() {
  // Validate environment variables
  if (!process.env.google_client_email || !process.env.google_private_key || !process.env.google_sheet_id) {
    return new Response(
      JSON.stringify({ error: 'Server configuration error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Create a new stream
  const stream = new ReadableStream({
    start(controller) {
      // Add this client to the set of connected clients
      clients.add(controller);

      // Send initial count
      getCurrentCount().then(count => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ count })}\n\n`));
      }).catch(error => {
        console.error('Error getting initial count:', error);
        controller.close();
        clients.delete(controller);
      });

      // Set up periodic refresh (every 30 seconds)
      const interval = setInterval(async () => {
        try {
          const count = await getCurrentCount();
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ count })}\n\n`));
        } catch (error) {
          console.error('Error refreshing count:', error);
          clearInterval(interval);
          controller.close();
          clients.delete(controller);
        }
      }, 30000);

      // Clean up when the client disconnects
      return () => {
        clearInterval(interval);
        clients.delete(controller);
      };
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

// Function to notify all clients of a count update
export async function notifyCountUpdate() {
  try {
    const count = await getCurrentCount();
    broadcastCount(count);
  } catch (error) {
    console.error('Error notifying clients of count update:', error);
  }
} 