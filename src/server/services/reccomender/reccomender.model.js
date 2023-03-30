import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const userRatingsSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  rating: { type: Number, required: true },
  recipeID: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Ratings", userRatingsSchema);
