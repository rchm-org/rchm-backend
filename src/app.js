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
   GLOBAL MIDDLEWARES
======================= */
app.use(cors());
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
// 🔐 Admin auth
app.use("/api/admin/auth", adminAuthRoutes);


// 🩺 He
export default app;