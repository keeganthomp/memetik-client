import { useSocket, SocketEvent } from './useSocket';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useSocketEvent = (eventName: SocketEvent, callback: (data?: any) => void) => {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      console.log(`Listening for ${eventName} event...`);
      socket.on(eventName, callback);
      return () => {
        socket.off(eventName, callback);
      };
    }
  }, [socket, eventName, callback]);
};

export default useSocketEvent;
