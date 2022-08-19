import { v4 as uuid4 } from "uuid";
import { Router } from "express";
import axios from "axios";

const recipesAPI = Router();

recipesAPI.get("/", async (req, res, next) => {
  const USER_DIET = "vegeterian";
  const USER_INTOLERANCES = "gluten";
  let recipesList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=effebab5dcc94c2eb7ab2114954311b2", {
      params: {
        diet: USER_DIET,
        intolerances: USER_INTOLERANCES,
      },
    })
    .catch((err) => console.log(err));
  //console.log(recipesList);
  res.json(recipesList.data.results);
});

recipesAPI.get("/item/:rid", async (req, res, next) => {
  const RECIPE_ID = req.params.rid;
  let recipeItem = await axios
    .get(
      `https://api.spoonacular.com/recipes/${RECIPE_ID}/information?apiKey=effebab5dcc94c2eb7ab2114954311b2&includeNutrition=true`
    )
    .catch((err) => console.log(err));
  //console.log(recipeItem.data);
  res.json(recipeItem.data);
});

export default recipesAPI;
