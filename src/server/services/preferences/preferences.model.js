import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const userPreferencesSchema = new Schema({
  diet: { type: String, required: true },
  intolerances: [
    {
      type: String,
      required: true,
    },
  ],
});

export default mongoose.model("Prefences", userPreferencesSchema);
