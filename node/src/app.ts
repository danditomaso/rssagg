import cors, { type CorsOptions } from "cors";
import compression from "compression";
import express from "express";

// Project dependencies
import envVars from "./envVars";
import helmet from "helmet";
import { v1Router } from "./routes";
import { startScraping } from "./scraper";
import { client } from "./db/client";

// Environment variable initialization
const port = envVars?.NODE_PORT

// Express initialization
const app = express();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Middlewares
const corsOptions: CorsOptions = {
  origin: ["https://*", "http://*"],
  allowedHeaders: ["Accept", "Authorization", "Content-Type", "X-CSRF-Token"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ['Link'],
  credentials: false,
  maxAge: 300
};

app.use(cors({ ...corsOptions }));
app.use(compression());
app.use(express.urlencoded({ extended: false })); // for parsing url-encoded 
app.use(express.json({ limit: '25mb' }));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": ["'self'"],
      },
    },
  })
);


startScraping({ client, limit: 4, timeBetweenRequests: '30seconds' })
// v1 Router
app.use('/v1', v1Router)

export default app;