import { Router } from "express";
import { v4 as uuid4 } from "uuid";
import mongoose from "mongoose";
import favouritesListItemSchema from "../services/favourites/favourites.model";
import userSchema from "../services/users/user.model";
import { PlaceSharp } from "@mui/icons-material";

const favouritesAPI = Router();

favouritesAPI.get("/:uid", async (req, res, next) => {
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
  //console.log(res)
});

favouritesAPI.get("/recipe/:rid", async (req, res, next) => {
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
});

favouritesAPI.post("/", async (req, res, next) => {
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
    fav = await favouritesListItemSchema.findOne({ recipeID: recipeID });
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
});

favouritesAPI.delete("/delete/:rid", async (req, res, next) => {
  const recipeID = req.params.rid;
  let recipe;
  try {
    recipe = await favouritesListItemSchema.findById(recipeID).populate("creator");
  } catch (err) {
    console.log(err);
    const error = new Error("Something went wrong! Could not delete recipe!");
    error.code = 500;
    return next(error);
  }

  if (!recipe) {
    const error = new Error("Could not find recipe for this id");
    error.code = 404;
    return next(error);
  }

  try {
    await recipe.delete();
    recipe.creator.favourites.pull(recipe);
    await recipe.creator.save();
  } catch (err) {
    const error = new Error("Something went wrong! Could not delete recipe2!");
    error.code = 500;
    return next(error);
  }

  res.status(200).json({ message: "Deleted recipe" });
});

export default favouritesAPI;
