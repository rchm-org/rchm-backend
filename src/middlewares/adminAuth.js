import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminAuth = async (req, res, next) => {
  try {
    const authHeader =
      req.headers.authorization || req.headers.Authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authentication token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    const admin = await User.findOne({
      _id: decoded.id,
      role: "admin",
    }).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not authorized",
      });
    }

    req.admin = admin;
    next();
  } catch (err) {
    console.error("adminAuth error:", err);
    res.status(500).json({
      message: "Authentication failed",
    });
  }
};
