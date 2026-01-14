export const adminOnly = (req, res, next) => {
  // adminAuth MUST run before this middleware
  if (!req.admin || req.admin.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }

  next();
};
