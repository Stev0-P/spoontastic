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
  }
];

preferencesAPI.post("/",  async (req, res, next) => {
  const { diet, intolerance, type, creator} = req.body;

  const createdPreferences = {
    diet,
    intolerance,
    type,
    creator
  };

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

  res.status(201).json({ preferances: createdPreferences });
});

preferencesAPI.get("/getPreferences/:pid", (req, res, next) => {
  const preferencesID = req.params.pid; //{}
  const preferences = DUMMY_PREFERENCES.find((p) => {
    return p.id === preferencesID;
  });
  if (!preferences) {
    const error = new Error(
      "Could not find a preference with the provided id."
    );
    error.code = 404;
    return next(error);
  }
  res.json({ preferences: preferences });
});

preferencesAPI.patch("/patchPreferences/:pid",(req, res, next) => {
  const { diet, intolerance, type } = req.body
  const preferencesId = req.params.pid;

  const updatedPreferences = { ...DUMMY_PREFERENCES.find(p => p.id === preferencesId)};
  const preferencesIndex = DUMMY_PREFERENCES.findIndex(p => p.id === preferencesId);
  if (diet) updatedPreferences.diet = diet;
  if (intolerance) updatedPreferences.intolerance = intolerance;
  if (type) updatedPreferences.type = type;

  DUMMY_PREFERENCES[preferencesIndex] = updatedPreferences;

  res.status(200).json({ preferences: updatedPreferences })
});

export default preferencesAPI;
