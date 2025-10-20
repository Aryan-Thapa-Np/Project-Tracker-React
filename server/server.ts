import express from 'express';
import type { Express } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import cookieParser from "cookie-parser";
import { testConnection } from './database/db.ts';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from "url";
import http from "http";
import { Server } from 'socket.io';

import { initNotificationSocket } from "./services/socket.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173","file://"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());




// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
// }));



app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === 'null' || origin.startsWith('file://')) {
      callback(null, true); // Allow `file://` and requests without origin (e.g., Electron)
    } else if (origin === 'http://localhost:5173') {
      callback(null, true); // Allow localhost development
    } else {
      callback(new Error('Origin not allowed'), false); // Deny any other origins
    }
  },
  credentials: true, // Allow cookies to be sent and received
}));


app.use("/user", express.static(path.join(__dirname, "./uploads/user")));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "http://localhost:5173", "http://localhost:4000", "file://"], // allow images
        connectSrc: ["'self'", "http://localhost:5173", "http://localhost:4000","file://"],     // allow API
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    frameguard: { action: "deny" },
  })
);


 
// Initialize with the server  ==> Notifications
initNotificationSocket(io);


import user from "./routes/auth.route.ts";
import task from "./routes/task.route.ts";
import users from "./routes/user.route.ts";
import projects from "./routes/projects.route.ts";


const port: number = parseInt(process.env.PORT || '4000', 10);


app.use("/api", user);
app.use("/api", task);
app.use("/api", users);
app.use("/api", projects);







// Start server
server.listen(port, () => {
  testConnection();
  console.log(`🚀 Server running on port: ${port}`);
});
