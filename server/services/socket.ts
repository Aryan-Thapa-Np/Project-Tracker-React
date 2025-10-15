import type { Server } from "socket.io";

let io: Server;

// Initialize with the server
export const initNotificationSocket = (serverIo: Server) => {
  io = serverIo;
};

// Emit a notification to everyone
export const emitNotification = ( count?: number ) => {
  if (!io) {
    console.warn("Socket.IO not initialized yet!");
    return;
  }
  console.log("yesss");
  io.emit("notification", count);
};
