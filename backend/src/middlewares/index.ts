import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import mongoSanitize from "express-mongo-sanitize";
const cookieParser = require("cookie-parser");

const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export function applyMiddlewares(app: Application) {
  app.use(express.json());
  app.use(cors(corsOptions));
  app.use(helmet({ contentSecurityPolicy: false, frameguard: { action: "deny" } }));
  app.use(morgan("dev"));
  app.use(cookieParser());
  app.use(mongoSanitize());
}
