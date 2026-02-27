import express from "express";
import {
  getAdmissions,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Apply auth + role check to ALL routes in this router
router.use(adminAuth, adminOnly);

router.get("/", getAdmissions);
router.patch("/:id/status", updateAdmissionStatus);

export default router;