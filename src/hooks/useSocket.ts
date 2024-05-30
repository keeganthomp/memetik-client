import { useContext } from 'react';
import { SocketContext } from '@/context/SocketContext';

export type SocketEvent = 'POOL_CREATED';

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
