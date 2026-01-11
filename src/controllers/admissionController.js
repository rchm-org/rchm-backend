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

    const admission = await Admission.create({
      name,
      email,
      phone,
      course,
      documents: {
        marksheet: req.files.marksheet[0].filename,
        idProof: req.files.idProof[0].filename,
        photo: req.files.photo[0].filename,
      },
    });

    res.status(201).json(admission);
  } catch (err) {
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
   UPDATE STATUS (APPROVE / ARCHIVE / UNARCHIVE)
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

    const admission = await Admission.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!admission) {
      return res.status(404).json({ message: "Admission not found" });
    }

    res.json(admission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
