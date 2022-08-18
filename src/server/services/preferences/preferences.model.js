import mongoose, { Schema, Document, LeanDocument } from "mongoose";

const userPreferencesSchema = new Schema({
  diet: { type: String, required: true },
  intolerances: {type: Array, required: true},
  type: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

export default mongoose.model('Preferences', userPreferencesSchema);
