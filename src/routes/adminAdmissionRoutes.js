import express from "express";
import {
  getAdmissions,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";
import { adminAuth } from "../middlewares/adminAuth.js";

const router = express.Router();

// adminAuth already verifies JWT and enforces admin role in one step
router.use(adminAuth);

router.get("/", getAdmissions);
router.patch("/:id/status", updateAdmissionStatus);

export default router;