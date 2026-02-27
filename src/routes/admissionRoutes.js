import express from "express";
import { createAdmission } from "../controllers/admissionController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 3 separate document fields — each optional, max 1 file each, max 2 MB
router.post(
    "/",
    upload.fields([
        { name: "marksheet", maxCount: 1 },
        { name: "idDocument", maxCount: 1 },
        { name: "photograph", maxCount: 1 },
    ]),
    createAdmission
);

export default router;