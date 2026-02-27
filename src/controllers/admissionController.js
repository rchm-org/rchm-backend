import Admission from "../models/Admission.js";

const VALID_STATUSES = ["pending", "approved", "archived"];

export const createAdmission = async (req, res) => {
  try {
    const data = req.body;

    // Cloudinary stores the secure URL on req.file.path
    const admission = await Admission.create({
      ...data,
      documents: req.file?.path ?? null,
    });

    res.status(201).json(admission);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create admission" });
  }
};

export const getAdmissions = async (req, res) => {
  try {
    const { status } = req.query;

    const query = status ? { status } : {};

    const admissions = await Admission.find(query).sort({
      createdAt: -1,
    });

    res.json(admissions);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch admissions" });
  }
};

export const updateAdmissionStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Admission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Admission not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update status" });
  }
};