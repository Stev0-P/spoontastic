import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const reccomenderSchema = new Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId },

    recs: [
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
      { type: String, required: true },
    ],
  },
  { collection: "recommended" }
);

export default mongoose.model("Recommended", reccomenderSchema);
