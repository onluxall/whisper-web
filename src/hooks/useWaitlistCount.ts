import { useState, useEffect } from 'react';

export function useWaitlistCount() {
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    const connect = () => {
      try {
        // Close existing connection if any
        if (eventSource) {
          eventSource.close();
        }

        // Create new connection
        eventSource = new EventSource('/api/waitlist/stream');

        // Handle incoming messages
        eventSource.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (typeof data.count === 'number') {
              setCount(data.count);
              setError(null);
            }
          } catch (error) {
            console.error('Error parsing SSE message:', error);
            setError('Failed to parse count update');
          }
        };

        // Handle connection errors
        eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          setError('Connection lost. Retrying...');
          eventSource?.close();
          
          // Attempt to reconnect after a delay
          setTimeout(connect, 5000);
        };
      } catch (error) {
        console.error('Error setting up SSE connection:', error);
        setError('Failed to connect to count stream');
      }
    };

    // Initial connection
    connect();

    // Cleanup on unmount
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return { count, error };
} 