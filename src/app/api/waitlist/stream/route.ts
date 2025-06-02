// Force this route to be dynamic - prevents static generation
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getCurrentCount, addClient, removeClient } from '@/lib/waitlist';

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
      addClient(controller);

      // Send initial count
      getCurrentCount().then(count => {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ count })}\n\n`));
      }).catch(error => {
        console.error('Error getting initial count:', error);
        controller.close();
        removeClient(controller);
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
          removeClient(controller);
        }
      }, 30000);

      // Clean up when the client disconnects
      return () => {
        clearInterval(interval);
        removeClient(controller);
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