import type { Server, Socket } from "socket.io";

let io: Server;

// userId -> array of socketIds (to handle multiple tabs/devices)
const onlineUsers: Record<string, string[]> = {};

export const initNotificationSocket = (serverIo: Server) => {
  io = serverIo;

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // Client must send its userId right after connecting
    socket.on("register_user", (userId: string) => {
      if (!onlineUsers[userId]) onlineUsers[userId] = [];
      onlineUsers[userId].push(socket.id);
      console.log(`Data:${Object.entries(onlineUsers)}`);
      console.log(`User ${userId} registered socket ${socket.id}`);
    });

    // Example event
    socket.on("profile_updated", (count: number) => {
      console.log(`User ${socket.id} updated profile`);
      socket.broadcast.emit("notification", { count });
    });

    // Handle disconnect and clean up
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      for (const [userId, sockets] of Object.entries(onlineUsers)) {
        onlineUsers[userId] = sockets.filter(id => id !== socket.id);
        if (onlineUsers[userId].length === 0) delete onlineUsers[userId];
      }
    });
  });
};

// Emit a notification to a specific user (all their sockets)
export const emitNotificationToUser = (userId: number, noticount: number) => {
  if (!io) return console.warn("Socket.IO not initialized yet!");
  console.log(`SENDING NOTI SIGNAL : ${noticount}`);


  const socketIds = onlineUsers[userId];
  if (socketIds && socketIds.length > 0) {
    console.log(`SENDING NOTI SIGNAL2 : ${noticount}`);
    socketIds.forEach(id => io.to(id).emit("notification", { noticount }));
  } else {
    console.log(`User ${userId} is offline`);
  }
};

// Emit a global notification
export const emitNotification = (noticount: number) => {
  if (!io) return console.warn("Socket.IO not initialized yet!");
  io.emit("notification", { noticount });
};
