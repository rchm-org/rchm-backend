import express from "express";
import cors from "cors";
import path from "path";

// Routes
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import admissionRoutes from "./routes/admissionRoutes.js";
import adminAdmissionRoutes from "./routes/adminAdmissionRoutes.js";

// Error handler
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

/* =======================
   CORS (HARDENED)
======================= */
const allowedOrigins = [
  "http://localhost:5173", // local dev
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / curl / Postman
      if (!origin) return callback(null, true);

      // Allow Vercel previews + allowed list
      if (
        origin.endsWith(".vercel.app") ||
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      // Reject silently (do NOT throw)
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

/* =======================
   BODY PARSER (LIMITED)
======================= */
app.use(
  express.json({
    limit: "100kb", // prevent large JSON attacks
  })
);

/* =======================
   STATIC FILES (SAFE)
======================= */
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"), {
    index: false,          // no directory listing
    dotfiles: "ignore",    // block .env, .gitignore, etc
    maxAge: "1d",
    setHeaders: (res) => {
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

/* =======================
   ROUTES
======================= */

// 🔓 Public
app.use("/api/admissions", admissionRoutes);

// 🔐 Admin
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/admissions", adminAdmissionRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is alive 🚀",
  });
});

/* =======================
   ERROR HANDLER (LAST)
======================= */
app.use(errorHandler);

export default app;
