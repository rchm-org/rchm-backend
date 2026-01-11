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
      enum: ["pending", "contacted", "closed"],
      default: "pending",
    },

    // ✅ NEW FIELD (this is the key)
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Admission", admissionSchema);
