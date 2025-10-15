// src/socket.ts
import { io, Socket } from "socket.io-client";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Create a singleton socket instance
const SOCKET_URL = `${apiUrl}`|| "http://localhost:3000"; 

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socket;
};
