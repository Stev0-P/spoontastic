import { Router } from "express";

const favouritesAPI = Router();

const DUMMY_FAVOURITE_RECIPES = [
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

favouritesAPI.get("/", (req, res, next) => {
  const recipe = DUMMY_FAVOURITE_RECIPES;
  res.json({ listofRecipes: recipe });
});

favouritesAPI.get("/:rid", (req, res, next) => {
  const recipeID = req.params.rid; //{}
  const recipe = DUMMY_FAVOURITE_RECIPES.find((r) => {
    return r.id === recipeID;
  });
  if (!recipe) {
    const error = new Error("Could not find a recipe with the provided id.");
    error.code = 404;
    return next(error);
  }
  res.json({ recipe: recipe });
});

favouritesAPI.post("/addToFav", (req, res, next) => {
  const { description, img } = req.body;

  const addedRecipe = {
    id: uuid4(),
    description,
    img,
  };

  DUMMY_FAVOURITE_RECIPES.push(addedRecipe);
  res.status(201).json({ recipe: addedRecipe });
});

favouritesAPI.delete("/delete/:rid", (req, res, next) => {
  const recipeId = req.params.rid;
  DUMMY_FAVOURITE_RECIPES = DUMMY_FAVOURITE_RECIPES.filter(
    (r) => r.id !== recipeId
  );
  res.status(200).json({ message: "Deleted recipe" });
});

export default favouritesAPI;