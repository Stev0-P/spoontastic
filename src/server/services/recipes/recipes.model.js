import mongoose, { Schema } from "mongoose";

const recipesListItemSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
});

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  macros: [
    {
      type: String,
      required: true,
    },
  ],
  ingredients: [
    {
      type: String,
      required: true,
    },
  ],
  recipe: [
    {
      type: String,
      required: true,
    },
  ],
  id: { type: String, required: true },
});

module.exports = mongoose.model("Recipes", recipesListItemSchema);
