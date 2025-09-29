import express from 'express';
import type { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });
import cookieParser from "cookie-parser";
import { testConnection } from './database/db.ts';
import cors from "cors";



const app: Express = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));



app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.example.com"],
        connectSrc: ["'self'", "http://localhost:5173"],
        objectSrc: ["'none'"], // disallow <object>, <embed>, <applet>
        upgradeInsecureRequests: [], // upgrade http requests to https
      },
    },
    frameguard: { action: 'deny' },
  })
);

import user from "./routes/auth.route.ts";
import task from "./routes/task.route.ts";

const port: number = parseInt(process.env.PORT || '4000', 10);


app.use("/api", user);
app.use("/api", task);


// Start server
app.listen(port, () => {
  testConnection();
  console.log(`🚀 Server running on port: ${port}`);
});
