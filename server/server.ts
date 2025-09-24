import express from 'express';
import type { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();


const app: Express = express();

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
    frameguard:{ action: 'deny' },
  })
);  


const port: number = parseInt(process.env.PORT || '4000', 10);


app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express 🚀');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port: ${port}`);
});
