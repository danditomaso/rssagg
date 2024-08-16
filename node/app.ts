import cors, { type CorsOptions } from "cors";
import compression from "compression";
import dotenv from "dotenv";
import { json } from 'body-parser'
import express from "express";

// Project dependencies
import healthRouter from "./src/routes/health";
import { errorHandler } from "./src/middleware/error";

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
app.use(json({ limit: '25mb' }));
app.use(json());

// 404 Route
app.use('*', (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} this route`,
  });
});


// Routes
// app.use(userRouter);
app.use(healthRouter);

// Error handling
app.use(errorHandler);

export default app;