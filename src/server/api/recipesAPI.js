import axios from "axios";
import { Router } from "express";

const recipesAPI = Router();

recipesAPI.get("/", async (req, res, next) => {
  const USER_DIET = req.query.userDiet;
  const USER_INTOLERANCES = req.query.userIntolerances;
  const MEAL_TYPE = req.query.mealType;
  /* console.log("MEALTYPE" + req.query.mealType);
  console.log("INTOLERANCES " + req.query.userIntolerances);
  console.log("DIET " + req.query.userDiet); */
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
  const QUERY_PARAMS = req.query;
  console.log(QUERY_PARAMS);
  let searchList = await axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=eb8c7f0fd49b4483886ec7688277716a", {
      params: {
        query: USER_QUERY,
        diet: QUERY_PARAMS.diet,
        intolerances: QUERY_PARAMS.intolerances,
        type: QUERY_PARAMS.type,
        maxReadyTime: QUERY_PARAMS.maxReadyTime,
        minCalories: QUERY_PARAMS.minCalories,
        maxCalories: QUERY_PARAMS.maxCalories,
        minProtein: QUERY_PARAMS.minProtein,
        maxProtein: QUERY_PARAMS.maxProtein,
        minCarbs: QUERY_PARAMS.minCarbs,
        maxCarbs: QUERY_PARAMS.maxCarbs,
        minFat: QUERY_PARAMS.minFat,
        maxFat: QUERY_PARAMS.maxFat,
      },
    })
    .catch((err) => console.log(err));

  console.log(searchList.data.results);

  res.json(searchList.data.results);
});

recipesAPI.get("/item/:rid", async (req, res, next) => {
  const RECIPE_ID = req.params.rid;
  let recipeItem = await axios
    .get(
      `https://api.spoonacular.com/recipes/${RECIPE_ID}/information?apiKey=eb8c7f0fd49b4483886ec7688277716a&includeNutrition=true`
    )
    .catch((err) => console.log(err));

  res.json(recipeItem.data);
});

recipesAPI.get("/random/", async (req, res, next) => {
  const USER_DIET = req.query.diet;
  const USER_INTOLERANCES = req.query.intolerances;
  const NUMBER = req.query.num;
  let randomItem = await axios
    .get(
      `https://api.spoonacular.com/recipes/random?number=${NUMBER}&tags=${USER_DIET}&apiKey=eb8c7f0fd49b4483886ec7688277716a`
    )
    .catch((err) => console.log(err));
  // console.log(randomItem.data);55995d23319347f2b5cb64612e2b959a
  //eb8c7f0fd49b4483886ec7688277716a
  //1391bf8184c14fb8ab85695eaaf42cf8
  res.json(randomItem.data);
});

export default recipesAPI;
