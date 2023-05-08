import favouritesListItemSchema from "../../services/favourites/favourites.model";
import userSchema from "../../services/users/user.model";

export const getAllFavouritesByUser = async (req, res, next) => {
  // logic for GET /:uid
  const userID = req.params.uid;
  let recipes;

  try {
    recipes = await favouritesListItemSchema.find({ creator: userID });
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    console.log(err);
    return next(error);
  }
  res.json({ recipe: recipes.map((recipe) => recipe.toObject({ getters: true })) });
};

export const getFavouriteByUserAndRecipe = async (req, res, next) => {
  // logic for GET /:uid/:rid
  const userID = req.params.uid;
  const recipeID = req.params.rid;
  let recipes;

  try {
    recipes = await favouritesListItemSchema.find({ creator: userID, recipeID: recipeID });
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    console.log(err);
    return next(error);
  }

  if (!recipes) {
    res.json({ recipe: "N/A" });
  }
  res.json({ recipe: recipes.map((recipe) => recipe.toObject({ getters: true })) });
};

export const getFavouriteByRecipeId = async (req, res, next) => {
  // logic for GET /recipe/:rid
  const recipeID = req.params.rid;
  let recipe;
  try {
    recipe = await favouritesListItemSchema.findById(recipeID);
  } catch (err) {
    const error = new Error("Something went worng!");
    error.code = 500;
    return next(error);
  }
  if (!recipe) {
    const error = new Error("Could not find a recipe with the provided id.");
    error.code = 404;
    return next(error);
  }
  res.json({ recipe: recipe.toObject({ getters: true }) });
};

export const addFavourite = async (req, res, next) => {
  // logic for POST /
  const { title, image, creator, recipeID } = req.body;

  const addedRecipe = new favouritesListItemSchema({
    title,
    image,
    creator,
    recipeID,
  });

  let user;
  let fav;

  try {
    user = await userSchema.findById(creator);
    fav = await favouritesListItemSchema.findOne({ recipeID: recipeID, creator: creator });
  } catch (err) {
    const error = new Error("Adding to Favourites failed!");
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
    if (fav === null) {
      await addedRecipe.save();
      user.favourites.push(addedRecipe);
      await user.save();
    }
  } catch (err) {
    const error = new Error("Adding to Favourites failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ recipe: addedRecipe });
};

export const deleteFavourite = async (req, res, next) => {
  // logic for DELETE /delete/:rid
  const recipeID = req.params.rid;

  let delRec;
  try {
    //recipe = await favouritesListItemSchema.findById(recipeID).populate("creator");
    delRec = await favouritesListItemSchema.findOne({ recipeID: recipeID }).populate("creator");
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong! Could not delete recipe!");
    error.code = 500;
    return next(error);
  }

  if (!delRec) {
    const error = new Error("Could not find recipe for this id");
    error.code = 404;
    return next(error);
  }

  try {
    await delRec.delete();
    delRec.creator.favourites.pull(delRec);
    await delRec.creator.save();
  } catch (err) {
    const error = new Error("Something went wrong! Could not delete recipe2!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ message: "Deleted recipe" });
};
