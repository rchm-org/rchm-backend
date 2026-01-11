import mongoose from "mongoose";

const admissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    course: {
      type: String,
      required: true,
    },

    documents: {
      marksheet: { type: String, required: true },
      idProof: { type: String, required: true },
      photo: { type: String, required: true },
    },

    status: {
      type: String,
      enum: ["pending", "contacted", "approved", "archived"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);
