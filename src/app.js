import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import admissionRoutes from "./routes/admissionRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminAdmissionRoutes from "./routes/adminAdmissionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

/* =======================
   DATABASE + AUTO-SEED
======================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    // Hotfix: Drop legacy referenceId unique index that causes 500 errors on new admissions
    try {
      await mongoose.connection.collection("admissions").dropIndex("referenceId_1");
      console.log("🧹 Dropped legacy referenceId_1 index");
    } catch (idxErr) {
      if (idxErr.code !== 27) { // 27 = IndexNotFound
        console.error("⚠️ Could not drop referenceId_1 index:", idxErr.message);
      }
    }

    // Auto-create admin account if it doesn't exist yet
    try {
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      if (email && password) {
        const exists = await User.findOne({ email });
        if (!exists) {
          const hashed = await bcrypt.hash(password, 10);
          await User.create({ email, password: hashed, role: "admin" });
          console.log("✅ Admin account created:", email);
        } else {
          console.log("ℹ️  Admin account already exists:", email);
        }
      }
    } catch (seedErr) {
      console.error("⚠️  Auto-seed failed:", seedErr.message);
    }
  })
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1);
  });

/* =======================
   SECURITY
======================= */
app.use(helmet());

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : ["https://www.rchm.org.in", "http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
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