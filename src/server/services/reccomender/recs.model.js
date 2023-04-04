import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const reccomenderSchema = new Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId },
    1: { type: Number, required: true },
    2: { type: Number, required: true },
    3: { type: Number, required: true },
    4: { type: Number, required: true },
    5: { type: Number, required: true },
    6: { type: Number, required: true },
    7: { type: Number, required: true },
    8: { type: Number, required: true },
    9: { type: Number, required: true },
    10: { type: Number, required: true },
    11: { type: Number, required: true },
    12: { type: Number, required: true },
  },
  { collection: "recommended" }
);

export default mongoose.model("Recommended", reccomenderSchema);
