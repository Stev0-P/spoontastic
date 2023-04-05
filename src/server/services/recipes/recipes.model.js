import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema({
  recipeID: { type: String, required: true },
  image: { type: String, required: true },
  title: { type: String, required: true },
  servings: { type: Number, required: true },
  readyInMinutes: { type: Number, required: true },
  diets: [{ type: Array, required: false }],
  cuisine: [{ type: Array, required: false }],
  type: [{ type: Array, required: false }],
});

export default mongoose.model("Recipes", recipeSchema);
