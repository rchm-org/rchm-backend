import express from "express";
import cors from "cors";
import path from "path";

// routes
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import adminAdmissionRoutes from "./routes/adminAdmissionRoutes.js";

const app = express();

/* =======================
   CORS (FIXED)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://rchm-admissions-frontend-mi9iwfjes.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server / Postman / curl
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ⚠️ IMPORTANT: DO NOT add app.options("*", cors())
app.use(express.json());

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================
   ROUTES
======================= */

// Public
app.use("/api/admissions", admissionRoutes);

// Admin
app.use("/api/admin/admissions", adminAdmissionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is alive 🚀" });
});

export default app;
