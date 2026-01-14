import express from "express";
import rateLimit from "express-rate-limit";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = express.Router();

// 🔐 Rate limiter for admin login
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Please try again later.",
  },
});

// 🛡️ Admin login (POST only)
router.post("/login", adminLoginLimiter, adminLogin);

// 🚫 Block other HTTP methods
router.all("/login", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

export default router;
