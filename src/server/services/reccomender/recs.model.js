import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const reccomenderSchema = new Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId },
    1: { type: Number, required: true },
    2: { type: Number, required: true },
  },
  { collection: "recommended" }
);

export default mongoose.model("Recommended", reccomenderSchema);
