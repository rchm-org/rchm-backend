import express from "express";
import mongoose from "mongoose";
import {
  getAdmissions,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// 🔐 Protect everything below
router.use(adminAuth);

router.get("/", getAdmissions);

router.patch("/:id", (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid admission ID" });
  }
  next();
}, updateAdmissionStatus);

export default router;
