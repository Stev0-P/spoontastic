import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  diet: { type: String, required: true },
  intolerances: [{ type: String, required: true }],
  JWT: { type: String, required: false },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Favourites" }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "Ratings" }],
  password: { type: String, required: false },
});

userSchema.plugin(uniqueValidator);

export default mongoose.model("User", userSchema);
