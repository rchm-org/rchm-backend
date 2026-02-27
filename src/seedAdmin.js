import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@rchm.org.in";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error("❌ ADMIN_PASSWORD environment variable is not set. Aborting.");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("⚠️  Admin already exists:", email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin created successfully");
    console.log("👉 Email:", email);

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seedAdmin();