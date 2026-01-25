import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    course: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "archived"],
      default: "pending",
    },
    documents: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);