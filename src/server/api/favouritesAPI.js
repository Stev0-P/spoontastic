import { Router } from "express";
import { v4 as uuid4 } from "uuid";
import mongoose from "mongoose";
import favouritesListItemSchema from "../services/favourites/favourites.model";
import { PlaceSharp } from "@mui/icons-material";

const favouritesAPI = Router();

let DUMMY_FAVOURITE_RECIPES = [
  {
    id: "1",
    description: "Pizza",
    img: "https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80",
  },
  {
    id: "2",
    description: "Buffalo Wings",
    img: "https://img.freepik.com/free-photo/delicious-fried-chicken-plate_144627-27379.jpg?t=st=1659444439~exp=1659445039~hmac=c5ed5f3cda87a715afd6430bd6132bf1c0a85569b58728b5d39229e69dcd0318",
  },
  {
    id: "3",
    description: "Rizzoto Pasta",
    img: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?&t=st=1659444485~exp=1659445085~hmac=aa7de2e42b79825cc04bf17eec6c034db604757b465907c0c0a5ebc5df72d11a",
  },
];

/*favouritesAPI.get("/", (req, res, next) => {
  const recipe = DUMMY_FAVOURITE_RECIPES;
  res.json({ listofRecipes: recipe });
});*/

favouritesAPI.get("/:uid", async (req, res, next) => {
  //get favourite by ID
  console.log(req.params.uid);
  const userID = req.params.uid; //{}
  let recipe;
  try {
    recipe = await favouritesListItemSchema.find({ creator: userID });
  } catch (err) {
    const error = new Error("Something went worng!");
    error.code = 500;
    console.log(err);
    return next(error);
  }
  if (!recipe || recipe.length === 0) {
    const error = new Error("Could not find a recipe with the provided id.");
    error.code = 404;
    return next(error);
  }
  res.json({ recipe: recipe.map((recipe) => recipe.toObject({ getters: true })) });
});

favouritesAPI.get("/recipe/:rid", async (req, res, next) => {
  //get favourite by userID
  const recipeID = req.params.rid; //{}
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

favouritesAPI.post("/addToFav", async (req, res, next) => {
  const { title, image, creator } = req.body;

  const addedRecipe = new favouritesListItemSchema({
    title,
    image,
    creator,
  });

  // DUMMY_FAVOURITE_RECIPES.push(addedRecipe);
  try {
    await addedRecipe.save();
  } catch (err) {
    const error = new Error("Adding to Favourites failed!");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ recipe: addedRecipe });
});

favouritesAPI.delete("/delete/:rid", (req, res, next) => {
  const recipeId = req.params.rid;
  DUMMY_FAVOURITE_RECIPES = DUMMY_FAVOURITE_RECIPES.filter((r) => r.id !== recipeId);
  res.status(200).json({ message: "Deleted recipe" });
});

export default favouritesAPI;
