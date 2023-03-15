import { Router } from "express";
import { v4 as uuid4 } from "uuid";
import userSchema from "../services/users/user.model";
import userPreferencesSchema from "../services/preferences/preferences.model";

const preferencesAPI = Router();

preferencesAPI.post("/", async (req, res, next) => {
  const { diet, intolerances, type, creator } = req.body;

  const createdPreferences = new userPreferencesSchema({
    diet,
    intolerances,
    type,
    creator,
  });

  let user;

  try {
    user = await userSchema.findById(creator);
  } catch (err) {
    const error = new Error("Adding to preferences failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error("Could not find user for provided id.");
    error.code = 404;
    return next(error);
  }

  try {
    await createdPreferences.save();
    user.preferences.push(createdPreferences);
    await user.save();
  } catch (err) {
    const error = new Error("Adding to preferences failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ preferences: createdPreferences });
});

preferencesAPI.get("/:uid", async (req, res, next) => {
  const userID = req.params.uid;

  let uPreferences;

  try {
    uPreferences = await userPreferencesSchema.findOne({ creator: userID });
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    console.log(err);
    return next(error);
  }

  if (!uPreferences || uPreferences.length === 0) {
    const error = new Error("Could not find a preference with the provided id.");
    error.code = 404;
    return next(error);
  }

  res.json(uPreferences);
});

preferencesAPI.patch("/change/", async (req, res, next) => {
  const { diet, intolerance, email } = req.body;
  const objectId = req.session.user ?? "";
  const myObjectUserId = objectId.toString();

  let preferences;

  try {
    preferences = await userSchema.findOne({ email: email });
  } catch (err) {
    const error = new Error("Something went wrong, could not update preference");
    error.code = 500;
    return next(error);
  }

  if (diet) preferences.diet = diet;
  if (intolerance) preferences.intolerances = intolerance;

  try {
    await preferences.save();
  } catch (err) {
    const error = new Error("Something went wrong, could not update place");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ preferences: preferences.toObject({ getters: true }) });
});

export default preferencesAPI;
