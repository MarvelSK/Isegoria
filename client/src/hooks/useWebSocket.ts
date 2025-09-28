import { useState, useEffect, useRef, useCallback } from 'react';
import { ClientMessage, WebSocketEvent } from '@shared/schema';

interface UseWebSocketProps {
  username: string;
  sessionId: string;
  onMessage?: (message: ClientMessage) => void;
  onUserJoined?: (username: string, activeUsers: number) => void;
  onUserLeft?: (username: string, activeUsers: number) => void;
  onActiveUsersUpdate?: (count: number) => void;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  connectionError: string | null;
  reconnect: () => void;
}

export function useWebSocket({
  username,
  sessionId,
  onMessage,
  onUserJoined,
  onUserLeft,
  onActiveUsersUpdate
}: UseWebSocketProps): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    try {
      // Following blueprint instructions for WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);

        // Send user join message
        ws.send(JSON.stringify({
          type: 'user_join',
          username,
          sessionId
        }));

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'heartbeat' }));
          }
        }, 30000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as WebSocketEvent | any;
          
          switch (data.type) {
            case 'new_message':
              onMessage?.(data.message);
              break;
            case 'user_joined':
              onUserJoined?.(data.username, data.activeUsers);
              onActiveUsersUpdate?.(data.activeUsers);
              break;
            case 'user_left':
              onUserLeft?.(data.username, data.activeUsers);
              onActiveUsersUpdate?.(data.activeUsers);
              break;
            case 'active_users_count':
              onActiveUsersUpdate?.(data.count);
              break;
            case 'message_history':
              // Handle initial message history
              if (data.messages && Array.isArray(data.messages)) {
                data.messages.forEach((message: ClientMessage) => {
                  onMessage?.(message);
                });
              }
              break;
            case 'heartbeat':
              // Respond to server heartbeat
              ws.send(JSON.stringify({ type: 'heartbeat_ack' }));
              break;
            case 'heartbeat_ack':
              // Server acknowledged our heartbeat
              break;
            default:
              console.log('Unknown WebSocket message type:', data.type);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        setIsConnected(false);
        
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }

        // Try to reconnect after 3 seconds if not a clean close
        if (event.code !== 1000 && event.code !== 1001) {
          setConnectionError('Connection lost. Reconnecting...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
      };

    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setConnectionError('Failed to connect');
    }
  }, [username, sessionId, onMessage, onUserJoined, onUserLeft, onActiveUsersUpdate]);

  const reconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setConnectionError(null);
    connect();
  }, [connect]);

  // Initialize connection
  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000); // Clean close
      }
    };
  }, [connect]);

  return {
    isConnected,
    connectionError,
    reconnect
  };
}