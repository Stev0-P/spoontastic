import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  preferences: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Preferences' }],
  JWT: { type: String, required: true },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Favourites' }]
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);
