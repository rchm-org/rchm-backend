import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import fs from "fs";
import app from "./app.js";

/* =======================
   ENV VALIDATION
======================= */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not defined");
  process.exit(1);
}

/* =======================
   ENSURE UPLOADS DIR
======================= */
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

/* =======================
   START SERVER
======================= */
let server;

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: false, // production-safe
    });

    console.log("✅ MongoDB connected");

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

startServer();

/* =======================
   GRACEFUL SHUTDOWN
======================= */
const shutdown = async (signal) => {
  console.log(`🛑 Received ${signal}. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    await mongoose.connection.close();
    console.log("✅ Shutdown complete");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
