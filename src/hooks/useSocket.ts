import { useContext } from 'react';
import { SocketContext } from '@/context/SocketContext';

export enum SocketEvent {
  POOL_CREATED = 'POOL_CREATED',
}

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};
