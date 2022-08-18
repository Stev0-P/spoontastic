import { Router } from "express";
import { v4 as uuid4 } from "uuid";
import userSchema from "../services/users/user.model";
import userPreferencesSchema from "../services/preferences/preferences.model";

const preferencesAPI = Router();

const DUMMY_PREFERENCES = [
  {
    id: "1",
    userId: "1",
    diet: "Gluten Free",
    intolerance: ["egg", "grain"],
    type: ["breakfast", "Snacks"],
  },
  {
    id: "2",
    userId: "1",
    diet: "Vegan",
    intolerance: ["egg", "soya", "dairy"],
    type: ["main course", "Snacks"],
  },
];

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
    uPreferences = await userPreferencesSchema.find({ creator: userID });
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

  res.json({ preferences: uPreferences.map((preferences) => preferences.toObject({ getters: true })) });
});

preferencesAPI.patch("/:pid", async (req, res, next) => {
  const { diet, intolerances, type } = req.body;
  const preferencesId = req.params.pid;

  let preferences;

  try {
    preferences = await userPreferencesSchema.findById(preferencesId);
  } catch (err) {
    const error = new Error("Something went wrong, could not update preference");
    error.code = 500;
    return next(error);
  }

  if (diet) preferences.diet = diet;
  if (intolerances) preferences.intolerances = intolerances;
  if (type) preferences.type = type;

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
