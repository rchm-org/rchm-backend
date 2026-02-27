import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";

// Backblaze B2 is S3-compatible — point the SDK at B2's S3 endpoint
const s3 = new S3Client({
  endpoint: process.env.B2_ENDPOINT, // e.g. https://s3.us-west-004.backblazeb2.com
  region: process.env.B2_REGION,     // e.g. us-west-004
  credentials: {
    accessKeyId: process.env.B2_KEY_ID,
    secretAccessKey: process.env.B2_APP_KEY,
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

// B2 storage via multer-s3
const storage = multerS3({
  s3,
  bucket: process.env.B2_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  // Files are public-readable (set bucket to public in B2 dashboard)
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