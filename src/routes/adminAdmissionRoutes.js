import express from "express";
import {
  getAdmissions,
  updateAdmissionStatus,
} from "../controllers/admissionController.js";
import { adminAuth } from "../middlewares/adminAuth.js";
import { adminOnly } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.use(adminAuth, adminOnly);

router.get("/", getAdmissions);
router.patch("/:id/status", adminAuth, async (req, res) => {
  const { status } = req.body;

  if (!["pending", "approved", "archived"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const updated = await Admission.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
});

export default router;