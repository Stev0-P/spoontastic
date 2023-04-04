import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const userRatingsSchema = new Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  title: { type: String, required: true },
  image: { type: String, required: true },
  rating: { type: Number, required: true },
  recipeID: { type: String, required: true },
  cuisine: { type: Array, required: false },
  diets: { type: Array, required: false },
  type: { type: Array, required: true },
  servings: { type: Number, required: true },
  readyInMinutes: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Ratings", userRatingsSchema);
