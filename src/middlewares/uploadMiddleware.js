import "dotenv/config";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// AWS S3 client — credentials and region from env
const s3 = new S3Client({
  region: process.env.AWS_REGION, // e.g. ap-south-1 (Mumbai)
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Only allow images and PDFs
const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowed.includes(file.mimetype)) {
    cb(new Error("Invalid file type. Only JPEG, PNG and PDF are allowed."), false);
  } else {
    cb(null, true);
  }
};

// S3 storage via multer-s3 (v3 API — bucket and key must be callback functions)
const storage = multerS3({
  s3,
  bucket: (_req, _file, cb) => cb(null, process.env.AWS_BUCKET_NAME),
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, `admissions/${uniqueName}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter,
});