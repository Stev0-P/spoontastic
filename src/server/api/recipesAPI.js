import axios from "axios";
import { Router } from "express";

const recipesAPI = Router();

recipesAPI.get("/", async (req, res, next) => {
  const USER_DIET = req.query.userDiet;
  const USER_INTOLERANCES = req.query.userIntolerances;
  const MEAL_TYPE = req.query.mealType;
  console.log("MEALTYPE" + req.query.mealType);
  console.log("INTOLERANCES " + req.query.userIntolerances);
  console.log("DIET " + req.query.userDiet);
  let recipesList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=1391bf8184c14fb8ab85695eaaf42cf8", {
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
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=1391bf8184c14fb8ab85695eaaf42cf8", {
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
      `https://api.spoonacular.com/recipes/${RECIPE_ID}/information?apiKey=1391bf8184c14fb8ab85695eaaf42cf8&includeNutrition=true`
    )
    .catch((err) => console.log(err));

  res.json(recipeItem.data);
});

recipesAPI.get("/random/", async (req, res, next) => {
  const USER_DIET = req.query.diet;
  const USER_INTOLERANCES = req.query.intolerances;
  let randomItem = await axios
    .get(`https://api.spoonacular.com/recipes/random?number=1&apiKey=1391bf8184c14fb8ab85695eaaf42cf8`)
    .catch((err) => console.log(err));
  // console.log(randomItem.data);
  res.json(randomItem.data);
});

export default recipesAPI;
