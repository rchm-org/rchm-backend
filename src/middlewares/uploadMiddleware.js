import "dotenv/config";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// AWS S3 client
export const s3 = new S3Client({
  region: process.env.AWS_REGION,
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

// S3 storage — files stored under admissions/<fieldname>/<timestamp>-<original>
const storage = multerS3({
  s3,
  bucket: (_req, _file, cb) => cb(null, process.env.AWS_BUCKET_NAME),
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
    cb(null, `admissions/${file.fieldname}/${uniqueName}`);
  },
});

// Multer instance — used as upload.fields([...]) in the route
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per file
  fileFilter,
});