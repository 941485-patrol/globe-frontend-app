import { io } from 'socket.io-client';

// TODO: Replace with your actual backend URL
const URL = import.meta.env.VITE_BACKEND_API_URL;
// TODO: Ensure VITE_BACKEND_API_URL is always defined in your .env file or build process.

export const socket = io(URL, {
  autoConnect: false,
});
