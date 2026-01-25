import express from "express";
import { createAdmission } from "../controllers/admissionController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/", upload.single("documents"), createAdmission);

export default router;