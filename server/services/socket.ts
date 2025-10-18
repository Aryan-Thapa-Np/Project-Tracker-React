import type { Server, Socket } from "socket.io";

let io: Server;

export const initNotificationSocket = (serverIo: Server) => {
  io = serverIo;

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("profile_updated", (count: number) => {
      console.log(`User ${socket.id} updated profile`);
      socket.broadcast.emit("notification", { count });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

// Emit a notification to everyone
export const emitNotification = (message: string) => {
  if (!io) {
    console.warn("Socket.IO not initialized yet!");
    return;
  }
  io.emit("notification", message);
};
