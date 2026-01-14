import multer from "multer";
import path from "path";
import crypto from "crypto";

// ================= CONFIG =================
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
];

// ================= STORAGE =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = crypto.randomBytes(16).toString("hex");
    cb(null, `${safeName}${ext}`);
  },
});

// ================= FILE FILTER =================
const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only JPG, PNG, and PDF files are allowed."),
      false
    );
  }

  cb(null, true);
};

// ================= MULTER INSTANCE =================
export const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter,
});
