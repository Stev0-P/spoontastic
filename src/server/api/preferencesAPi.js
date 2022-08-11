import { Router } from "express";

const preferencesAPI = Router();

const DUMMY_PREFERENCES = [
  {
    id: 1,
    userId: 1,
    diet: "Gluten Free",
    intolerance: ("Egg", "Gluten", "Grain"),
    time: "Breakfast",
  },
];

const createPreference = (req, res, next) => {
  const { diet, intolerance, time } = req.body;

  const createdPreference = {
    diet,
    intolerance,
    time,
  };

  DUMMY_PREFERENCES.push(createdPreference);

  res.status(201).json({ preferance: createdPreference });
};

export default preferencesAPI;
