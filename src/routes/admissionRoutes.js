import express from "express";
import multer from "multer";
import { createAdmission } from "../controllers/admissionController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public submission
router.post(
  "/",
  upload.fields([
    { name: "marksheet", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  createAdmission
);

export default router;
