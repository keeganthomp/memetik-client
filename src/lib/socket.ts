import { io, Socket } from 'socket.io-client';

if (!import.meta.env.VITE_SOCKET_URL) {
  throw new Error('VITE_SOCKET_URL env is required');
}

const socket: Socket = io(import.meta.env.VITE_SOCKET_URL, {
  withCredentials: true,
  transports: ['websocket'],
});

export default socket;
