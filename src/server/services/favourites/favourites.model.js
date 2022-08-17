import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const favouritesListItemSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
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
});

export default mongoose.model('Favourites', favouritesListItemSchema);
