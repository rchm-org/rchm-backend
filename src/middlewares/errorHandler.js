import multer from "multer";

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack ?? err.message);

  // Multer file size exceeded
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File too large. Maximum size is 2 MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }

  // File type rejection from our custom fileFilter
  if (err.message?.includes("Invalid file type")) {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Server error",
  });
};