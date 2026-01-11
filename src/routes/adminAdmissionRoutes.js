import express from "express";
import {
  getAdmissions,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// 🔐 All admin admissions routes (protected)
router.get("/", adminAuth, getAdmissions);
router.patch("/:id", adminAuth, updateAdmissionStatus);

export default router;
