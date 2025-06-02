import { google } from 'googleapis';

// Your Google Sheets credentials and configuration
const SPREADSHEET_ID = process.env.google_sheet_id;
const WAITLIST_SHEET_RANGE = 'Waitlist!A:A';

// Store active connections
const clients = new Set<ReadableStreamDefaultController>();

// Function to broadcast count to all connected clients
export function broadcastCount(count: number) {
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
export async function getCurrentCount(): Promise<number> {
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

// Function to notify all clients of a count update
export async function notifyCountUpdate() {
  try {
    const count = await getCurrentCount();
    broadcastCount(count);
  } catch (error) {
    console.error('Error notifying clients of count update:', error);
  }
}

// Function to add a new client
export function addClient(controller: ReadableStreamDefaultController) {
  clients.add(controller);
}

// Function to remove a client
export function removeClient(controller: ReadableStreamDefaultController) {
  clients.delete(controller);
} 