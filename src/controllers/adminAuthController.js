import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic sanity check
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await User.findOne({
      email,
      role: "admin",
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // 🔑 JWT WITH EXPIRY
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } // ⏱️ 2 hours
    );

    return res.json({
      token,
      admin: {
        email: admin.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Login failed",
    });
  }
};
