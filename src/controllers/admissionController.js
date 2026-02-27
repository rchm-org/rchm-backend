import Admission from "../models/Admission.js";
import { s3 } from "../middlewares/uploadMiddleware.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { generateAdmissionPDF } from "../utils/generatePdf.js";

const VALID_STATUSES = ["pending", "approved", "archived"];

export const createAdmission = async (req, res) => {
  try {
    const data = req.body;

    // req.files is a dict keyed by fieldname when using upload.fields()
    const files = req.files ?? {};

    let admission = await Admission.create({
      ...data,
      documents: {
        marksheet: files.marksheet?.[0]?.location ?? null,
        idDocument: files.idDocument?.[0]?.location ?? null,
        photograph: files.photograph?.[0]?.location ?? null,
      },
    });

    // Generate PDF receipt buffer
    const pdfBuffer = await generateAdmissionPDF(admission);
    const pdfKey = `admissions/receipts/${admission._id}-receipt.pdf`;

    // Upload PDF directly to S3
    await s3.send(new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: pdfKey,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      ACL: "public-read",
      ContentDisposition: "inline"
    }));

    // S3 URL format
    const applicationPdfUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${pdfKey}`;

    // Update admission record with the PDF link
    admission = await Admission.findByIdAndUpdate(
      admission._id,
      { applicationPdf: applicationPdfUrl },
      { new: true }
    );

    res.status(201).json(admission);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create admission" });
  }
};

export const getAdmissions = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const admissions = await Admission.find(query).sort({ createdAt: -1 });
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