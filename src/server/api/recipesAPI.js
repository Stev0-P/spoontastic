import axios from "axios";
import { Router } from "express";

const recipesAPI = Router();

recipesAPI.get("/", async (req, res, next) => {
  const USER_DIET = req.query.userDiet;
  const USER_INTOLERANCES = req.query.userIntolerances;
  const MEAL_TYPE = req.query.mealType;
  let recipesList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=a1ec857afbaf4c8b893ec4a9ae744012", {
      params: {
        diet: USER_DIET,
        intolerances: USER_INTOLERANCES,
        type: MEAL_TYPE,
      },
    })
    .catch((err) => console.log(err));

  res.json(recipesList.data.results);
});

recipesAPI.get("/search/", async (req, res, next) => {
  const USER_QUERY = req.query.userQuery;
  let searchList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=a1ec857afbaf4c8b893ec4a9ae744012", {
      params: {
        query: USER_QUERY,
      },
    })
    .catch((err) => console.log(err));

  res.json(searchList.data.results);
});

recipesAPI.get("/item/:rid", async (req, res, next) => {
  const RECIPE_ID = req.params.rid;
  let recipeItem = await axios
    .get(
      `https://api.spoonacular.com/recipes/${RECIPE_ID}/information?apiKey=a1ec857afbaf4c8b893ec4a9ae744012&includeNutrition=true`
    )
    .catch((err) => console.log(err));

  res.json(recipeItem.data);
});

recipesAPI.get("/random/", async (req, res, next) => {
  const USER_DIET = req.query.diet;
  const USER_INTOLERANCES = req.query.intolerances;
  let randomItem = await axios
    .get(`https://api.spoonacular.com/recipes/random?number=1&apiKey=a1ec857afbaf4c8b893ec4a9ae744012`)
    .catch((err) => console.log(err));
  // console.log(randomItem.data);
  res.json(randomItem.data);
});

export default recipesAPI;
