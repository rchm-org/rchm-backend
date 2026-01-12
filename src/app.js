import express from "express";
import cors from "cors";
import path from "path";

// Routes
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import adminAdmissionRoutes from "./routes/adminAdmissionRoutes.js";

const app = express();

/* =======================
   CORS (PRODUCTION SAFE)
======================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://rchm-admissions-frontend.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server & tools
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================
   ROUTES
======================= */
app.use("/api/admissions", admissionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/admissions", adminAdmissionRoutes);

/* =======================
   HEALTH
======================= */
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", message: "Backend alive 🚀" });
});

/* =======================
   ERROR HANDLER (MANDATORY)
======================= */
app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

export default app;
