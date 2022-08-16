import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const favouritesListItemSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  creator: { type: String, required: true },
});

export default mongoose.model("Favourites", favouritesListItemSchema);
