import { v4 as uuid4 } from "uuid";
import { Router } from "express";
import axios from "axios";

const recipesAPI = Router();

recipesAPI.get("/", async (req, res, next) => {
  const USER_DIET = req.query.userDiet;
  const USER_INTOLERANCES = req.query.userIntolerances;
  const MEAL_TYPE = req.query.mealType;
  let recipesList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=06f5482408704f2287d7e2cdfeba8505", {
      params: {
        diet: USER_DIET,
        intolerances: USER_INTOLERANCES,
        type: MEAL_TYPE,
      },
    })
    .catch((err) => console.log(err));
  //console.log(recipesList);
  res.json(recipesList.data.results);
});
recipesAPI.get("/search/", async (req, res, next) => {
  const USER_QUERY = req.query.userQuery;
  let searchList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=06f5482408704f2287d7e2cdfeba8505", {
      params: {
        query: USER_QUERY,
      },
    })
    .catch((err) => console.log(err));
  //console.log(recipesList);
  res.json(searchList.data.results);
});

recipesAPI.get("/item/:rid", async (req, res, next) => {
  const RECIPE_ID = req.params.rid;
  let recipeItem = await axios
    .get(
      `https://api.spoonacular.com/recipes/${RECIPE_ID}/information?apiKey=06f5482408704f2287d7e2cdfeba8505&includeNutrition=true`
    )
    .catch((err) => console.log(err));
  //console.log(recipeItem.data);
  res.json(recipeItem.data);
});

recipesAPI.get("/random/", async (req, res, next) => {
  const USER_DIET = req.query.userDiet;
  const USER_INTOLERANCES = req.query.userIntolerances;
  const MEAL_TYPE = req.query.mealType;
  let randomItem = await axios
    .get(`https://api.spoonacular.com/recipes/random?number=1&apiKey=06f5482408704f2287d7e2cdfeba8505`, {
      params: {
        tags: USER_DIET,
        USER_INTOLERANCES,
        MEAL_TYPE,
      },
    })
    .catch((err) => console.log(err));
  //console.log(recipeItem.data);
  res.json(randomItem.data);
});

export default recipesAPI;
