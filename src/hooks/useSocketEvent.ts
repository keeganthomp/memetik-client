import { useSocket, SocketEvent } from './useSocket';
import { useEffect } from 'react';

// Define the hook with a generic type T for the data
const useSocketEvent = <T>(eventName: SocketEvent, callback: (data: T) => void) => {
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