import { v4 as uuid4 } from "uuid";
import { response, Router } from "express";
import axios from "axios";

const recipesAPI = Router();

const DUMMY_RECIPES = [
  {
    id: "1",
    description: "Pizza",
    img: "https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80",
    route: "/recipe:id",
  },
  {
    id: "2",
    description: "Buffalo Wings",
    img: "https://img.freepik.com/free-photo/delicious-fried-chicken-plate_144627-27379.jpg?t=st=1659444439~exp=1659445039~hmac=c5ed5f3cda87a715afd6430bd6132bf1c0a85569b58728b5d39229e69dcd0318",
    route: "/recipe:id",
  },
  {
    id: "3",
    description: "Rizzoto Pasta",
    img: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?&t=st=1659444485~exp=1659445085~hmac=aa7de2e42b79825cc04bf17eec6c034db604757b465907c0c0a5ebc5df72d11a",
    route: "/recipe:id",
  },
];

recipesAPI.get("/", (req, res, next) => {
  let recipes;
  const USER_DIET = "vegeterian";
  const USER_INTOLERANCES = "gluten";
  axios
    .get("https://api.spoonacular.com/recipes/complexSearch?apiKey=effebab5dcc94c2eb7ab2114954311b2", {
      params: {
        diet: USER_DIET,
        intolerances: USER_INTOLERANCES,
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
  const recipe = DUMMY_RECIPES;

  res.json({ listofRecipes: recipe });
});

recipesAPI.get("/:rid", (req, res, next) => {
  const RECIPE_ID = req.params.rid; //{}
  /*const recipe = DUMMY_RECIPES.find((r) => {
    return r.id === recipeID;
  });
  if (!recipe) {
    const error = new Error("Could not find a recipe with the provided id.");
    error.code = 404;
    return next(error);
  }
  res.json({ recipe: recipe }); */
  axios
    .get(`https://api.spoonacular.com/recipes/${RECIPE_ID}/information?apiKey=effebab5dcc94c2eb7ab2114954311b2`, {
      params: {
        id: RECIPE_ID,
      },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
});

export default recipesAPI;
