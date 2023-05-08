import { Router } from "express";

import {
  getAllFavouritesByUser,
  getFavouriteByUserAndRecipe,
  getFavouriteByRecipeId,
  addFavourite,
  deleteFavourite,
} from "../controllers/favourites/favourites.controller";

const favouritesAPI = Router();

favouritesAPI.get("/:uid", getAllFavouritesByUser);

favouritesAPI.get("/:uid/:rid", getFavouriteByUserAndRecipe);

favouritesAPI.get("/recipe/:rid", getFavouriteByRecipeId);

favouritesAPI.post("/", addFavourite);

favouritesAPI.delete("/delete/:rid", deleteFavourite);

export default favouritesAPI;
