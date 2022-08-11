import { v4 as uuid4 } from "uuid";

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

const createPreferences = (req, res, next) => {
  const { diet, intolerance, type} = req.body;

  const createdPreferences = {
    id: uuid4(),
    diet,
    intolerance,
    type,
  };

  DUMMY_PREFERENCES.push(createdPreferences);

  res.status(201).json({ preferances: createdPreferences });
};

const getPreferencesById = (req, res, next) => {
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
};

const updatePreferences = (req, res, next) => {
  const { diet, intolerance, type } = req.body
  const preferencesId = req.params.pid;

  const updatedPreferences = { ...DUMMY_PREFERENCES.find(p => p.id === preferencesId)};
  const preferencesIndex = DUMMY_PREFERENCES.findIndex(p => p.id === preferencesId);
  if (diet) updatedPreferences.diet = diet;
  if (intolerance) updatedPreferences.intolerance = intolerance;
  if (type) updatedPreferences.type = type;

  DUMMY_PREFERENCES[preferencesIndex] = updatedPreferences;

  res.status(200).json({ preferences: updatedPreferences })
}

const _createPreferences = createPreferences;
const _getPreferencesById = getPreferencesById;
const _updatePreferences = updatePreferences;

export { _createPreferences as createPreferences };
export { _getPreferencesById as getPreferencesById };
export { _updatePreferences as updatePreferences };
