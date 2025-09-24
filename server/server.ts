import express, { urlencoded } from 'express';
import type { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });
import { testConnection } from './database/db.ts';
import user from "./routes/auth.route.ts";



const app: Express = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://images.example.com"],
        connectSrc: ["'self'", "https://api.example.com"], // allow API requests
        objectSrc: ["'none'"], // disallow <object>, <embed>, <applet>
        upgradeInsecureRequests: [], // upgrade http requests to https
      },
    },
    frameguard: { action: 'deny' },
  })
);


const port: number = parseInt(process.env.PORT || '4000', 10);


app.use("/api", user);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express 🚀');
});

// Start server
app.listen(port, () => {
  testConnection();
  console.log(`🚀 Server running on port: ${port}`);
});
