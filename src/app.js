import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoose from "mongoose";
import dotenv from "dotenv";

import admissionRoutes from "./routes/admissionRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminAdmissionRoutes from "./routes/adminAdmissionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

/* =======================
   DATABASE
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

/* =======================
   SECURITY
======================= */
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

/* =======================
   MIDDLEWARE
======================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* =======================
   ROUTES
======================= */
app.use("/api/admissions", admissionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/admissions", adminAdmissionRoutes);

/* =======================
   ERROR HANDLER
======================= */
app.use(errorHandler);

export default app;