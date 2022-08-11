import { Router } from "express";

const recipeControllers = require("../controllers/recipes-controller");

const router = Router();

router.get("/recipe/:rid", recipeControllers.getRecipeById);

router.post("/", recipeControllers.addFavouriteRecipe);

export default router;
