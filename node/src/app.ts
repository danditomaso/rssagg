import cors, { type CorsOptions } from "cors";
import compression from "compression";
import express from "express";

// Project dependencies
import healthRouter from "./routes/health";
import userRouter from "./routes/users";
import { errorHandler } from "./middleware/error";
import envVars from "./envVars";

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
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '25mb' }));

// 404 Route
// app.use('*', (req, res) => {
//   res.status(404).json({
//     message: `Can't find ${req.originalUrl} this route`,
//   });
// });


// Routes
app.use('/v1', userRouter);
app.use('/v1', healthRouter);

// Error handling
app.use(errorHandler);

export default app;