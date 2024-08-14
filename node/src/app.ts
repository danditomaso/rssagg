import cors, { type CorsOptions } from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { json } from 'body-parser'
import express from "express";

// Project dependencies
import healthRouter from "./routes/health";
import { errorHandler } from "./middleware/error";

// Environment variable initialization
const env_vars = dotenv.config({ path: "../.env" });
const port = env_vars?.parsed ? env_vars.parsed.NODE_PORT : "";

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
app.use(json());

// Routes
// app.use(userRouter);
app.use(healthRouter);

// Error handling
app.use(errorHandler);

export default app;