import express from "express";
import rateLimit from "express-rate-limit";
import { createAdmission } from "../controllers/admissionController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🛡️ Rate limit public submissions
const admissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // 3 submissions per IP
  message: {
    message: "Too many submissions. Please try again later.",
  },
});

// 📩 Public admission submission
router.post(
  "/",
  admissionLimiter,
  upload.fields([
    { name: "marksheet", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  (req, res, next) => {
    // Basic sanity check
    if (!req.body.name || !req.body.phone || !req.body.course) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    next();
  },
  createAdmission
);

export default router;
