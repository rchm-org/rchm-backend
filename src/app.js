import express from "express";
import cors from "cors";
import path from "path";

// routes
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import adminAdmissionRoutes from "./routes/adminAdmissionRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

/* =======================
   CORS CONFIG (PRODUCTION SAFE)
======================= */
const allowedOrigins = [
  "https://rchm-admissions-frontend-1r10ifftz.vercel.app",
  "https://rchm-admissions-frontend.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔑 Handle preflight requests explicitly
app.options("*", cors());

/* =======================
   GLOBAL MIDDLEWARES
======================= */
app.use(express.json());

/* =======================
   STATIC FILES
======================= */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

/* =======================
   ROUTES
======================= */

// 🔓 Public
app.use("/api/admissions", admissionRoutes);

// 🔐 Admin
app.use("/api/admin/admissions", adminAdmissionRoutes);
app.use("/api/admin/auth", adminAuthRoutes);

// 🩺 Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is alive 🚀" });
});

/* =======================
   ERROR HANDLER (MUST BE LAST)
======================= */
app.use(errorHandler);

export default app;
