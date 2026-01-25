import Admission from "../models/Admission.js";

export const createAdmission = async (req, res) => {
  const data = req.body;

  const admission = await Admission.create({
    ...data,
    documents: req.file?.filename,
  });

  res.status(201).json(admission);
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
  const { status } = req.body;

  const updated = await Admission.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
};