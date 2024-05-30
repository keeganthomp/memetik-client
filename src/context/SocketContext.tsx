import React, { createContext, useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';

if (!import.meta.env.VITE_SOCKET_URL) {
  throw new Error('VITE_SOCKET_URL env is required');
}

export const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useMemo(() => {
    return io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });
  }, []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    return () => {
      socket.off('connect');
    };
  }, [socket]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
