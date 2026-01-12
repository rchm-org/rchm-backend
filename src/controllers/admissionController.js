import Admission from "../models/Admission.js";

/* =====================
   CREATE ADMISSION
===================== */
export const createAdmission = async (req, res) => {
  try {
    const { name, email, phone, course } = req.body;

    if (!req.files?.marksheet || !req.files?.idProof || !req.files?.photo) {
      return res.status(400).json({ message: "All documents are required" });
    }

    /* =====================
       GENERATE REFERENCE ID
    ===================== */
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");

    const prefix = `RCHM-${yy}${mm}`;

    const count = await Admission.countDocuments({
      referenceId: { $regex: `^${prefix}` },
    });

    const referenceId = `${prefix}-${String(count + 1).padStart(4, "0")}`;

    /* =====================
       CREATE ADMISSION
    ===================== */
    const admission = await Admission.create({
      name,
      email,
      phone,
      course,
      referenceId,
      documents: {
        marksheet: req.files.marksheet[0].filename,
        idProof: req.files.idProof[0].filename,
        photo: req.files.photo[0].filename,
      },
    });

    res.status(201).json({
      message: "Application submitted successfully",
      referenceId,
      admission,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

/* =====================
   GET ALL ADMISSIONS
===================== */
export const getAdmissions = async (req, res) => {
  const admissions = await Admission.find().sort({ createdAt: -1 });
  res.json(admissions);
};

/* =====================
   UPDATE STATUS (SAFE)
===================== */
export const updateAdmissionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "contacted",
      "approved",
      "archived",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const admission = await Admission.findById(id);

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    /* 🔒 HARD BUSINESS RULES */

    // Approved → Archived ❌
    if (admission.status === "approved" && status === "archived") {
      return res.status(400).json({
        message: "Approved applications cannot be archived",
      });
    }

    // Archived → Approved ❌
    if (admission.status === "archived" && status === "approved") {
      return res.status(400).json({
        message: "Archived applications cannot be approved",
      });
    }

    // Same status update → no-op (safe)
    if (admission.status === status) {
      return res.json(admission);
    }

    admission.status = status;
    await admission.save();

    res.json(admission);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
