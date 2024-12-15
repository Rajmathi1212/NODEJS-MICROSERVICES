import mongoose from "mongoose";
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import ENV from "./env";
import cookieParser from "cookie-parser";
import { createServer } from "http";

dotenv.config();

import { logger } from "./libs/logger";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger_output.json";

import { startWebSocketServer } from './listeners/websocketserver';
import { userRouter } from "./routes/userRoutes";
import { authRouter } from "./routes/authRoutes";
import { eventRouter } from "./routes/eventRoutes";

const app = express();
const httpServer = createServer(app);

const startServer = async () => {
  try {
    app.use(cookieParser());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.get("/api/v1/health", (req: Request, res: Response) => {
      res.send("Server Running Healthy.");
    });

    const DB = process.env.DB_URL!;
    mongoose
      .connect(DB)
      .then(() => {
        console.log("MongoDB connected successfully");
      })
      .catch((error) => {
        console.error("MongoDB connection error:", error);
      });

    app.use("/api/v1/user", userRouter);
    app.use("/api/v1/auth", authRouter);
    app.use("/api/v1/event", eventRouter);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    startWebSocketServer(httpServer);

    const PORT = ENV.PORT || 3000;
    const BASE_URL = ENV.BASE_URL || `http://localhost:${PORT}`;
    httpServer.listen(PORT, () => {
      logger(`Server is running on ${BASE_URL}`);
      console.log(`Swagger docs available at ${BASE_URL}/api-docs`);
    });
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
};

startServer();
