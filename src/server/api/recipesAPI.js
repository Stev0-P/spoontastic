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
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=eb8c7f0fd49b4483886ec7688277716a", {
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
  //55995d23319347f2b5cb64612e2b959a
  //49893dae331645b9a274b9c751583081
  //395a9e2f96d54634b79e0f249ee375b1
  res.json(randomItem.data);
});

recipesAPI.get("/similar/", async (req, res, next) => {
  const RECIPE_ID = req.query.recipeID;

  let similarItem = await axios
    .get(`https://api.spoonacular.com/recipes/${RECIPE_ID}/similar&apiKey=eb8c7f0fd49b4483886ec7688277716a`)
    .catch((err) => console.log(err));
  // console.log(randomItem.data);55995d23319347f2b5cb64612e2b959a
  //eb8c7f0fd49b4483886ec7688277716a
  //55995d23319347f2b5cb64612e2b959a
  //49893dae331645b9a274b9c751583081
  //395a9e2f96d54634b79e0f249ee375b1
  res.json(similarItem.data);
});

export default recipesAPI;
