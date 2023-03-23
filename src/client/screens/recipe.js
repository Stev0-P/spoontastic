import React from "react";
import { Box } from "@mui/system";
import { Typography, List, ListItem, ListItemText, Chip, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import parse from "html-react-parser";
import axios from "axios";
import UserContext from "../context/User";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { orange } from "@mui/material/colors";

const Demo = styled("div")(({ theme }) => ({
  backgroundColor: "white",
}));

const Recipe = () => {
  const history = useHistory();
  const location = useLocation();
  const recipeID = location.pathname.split("/").pop();
  //console.log(recipeID);
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [rating, setRating] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [recDiet, setRecDiet] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [method, setMethod] = useState([]);
  const [diets, setDiets] = useState([]);
  const [currentDiet, setCurrentDiet] = useState("");
  const [alert, setAlert] = useState(false);
  const [matched, setMatched] = useState();
  const [favourited, setFavourited] = useState(false);
  const activeUser = useContext(UserContext);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get(`/api/recipes/item/${recipeID}`);
        setRecipe(response);
        setMethod(response.analyzedInstructions[0].steps);
        setIngredients(response.nutrition.ingredients);
        setDiets(response.diets);
        ratingScore(response.healthScore);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchApi();
    ratingScore();
  }, []);

  useEffect(() => {
    setRecDiet(recipe.diets);
    setRefresh(true);
    dietParse();
  }, [recipe]);

  useEffect(() => {
    if (recDiet !== undefined && recipe.diets) {
      if (recDiet?.length === 0 && currentDiet !== "regular") {
        setMatched(false);
      }
      for (var i = 0; i <= recDiet?.length; i++) {
        if (currentDiet === "regular") {
          setMatched(true);
          break;
        } else if (currentDiet === "pescatarian" && (recipe.vegetarian === true || currentDiet === recDiet[i])) {
          setMatched(true);
          break;
        } else if (currentDiet === recDiet[i]) {
          setMatched(true);
          break;
        } else if (recDiet?.length !== 0) {
          setMatched(false);
        }
      }
    }
  }, [recDiet]);

  useEffect(() => {
    if (matched !== undefined) {
      if (matched === false) {
        setAlert(true);
      } else {
      }
    }
  }, [matched]);

  const dietParse = () => {
    if (activeUser.diet === "gluten free") {
      setCurrentDiet("gluten free");
    } else if (activeUser.diet === "ketogenic") {
      setCurrentDiet("ketogenic");
    } else if (activeUser.diet === "vegetarian") {
      setCurrentDiet("vegetarian");
    } else if (activeUser.diet === "lacto-vegetarian") {
      setCurrentDiet("lacto ovo vegetarian");
    } else if (activeUser.diet === "ovo-vegetarian") {
      setCurrentDiet("lacto ovo vegetarian");
    } else if (activeUser.diet === "vegan") {
      setCurrentDiet("vegan");
    } else if (activeUser.diet === "pescatarian") {
      setCurrentDiet("pescatarian");
    } else if (activeUser.diet === "paleo") {
      setCurrentDiet("paleolithic");
    } else if (activeUser.diet === "primal") {
      setCurrentDiet("primal");
    } else if (activeUser.diet === "whole30") {
      setCurrentDiet("whole 30");
    } else if (activeUser.diet === "regular") {
      setCurrentDiet("regular");
    }
  };

  const onFavourite = (item) => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/favourites/", {
          title: item.title,
          image: item.image,
          creator: activeUser.userId,
          recipeID: item.id,
        });

        setFavourited(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  const ratingScore = (sc) => {
    if (sc >= 0 && sc <= 20) {
      setRating(1);
    } else if (sc >= 21 && sc <= 40) {
      setRating(2);
    } else if (sc >= 41 && sc <= 60) {
      setRating(3);
    } else if (sc >= 61 && sc <= 80) {
      setRating(4);
    } else if (sc >= 81 && sc <= 100) {
      setRating(5);
    }
  };

  return (
    <Box sx={{ marginLeft: "15vh" }}>
      <Box sx={{ display: " flex", flexDirection: "column" }}>
        {alert === true ? (
          <Alert severity="warning" sx={{ padding: "10px" }}>
            <AlertTitle>Warning</AlertTitle>
            This recipe does not match your dietary and intolerance preferences.
          </Alert>
        ) : (
          ""
        )}
        <Box sx={{ marginLeft: 3, marginTop: 4 }}>
          <Typography variant="h3">{recipe.title}</Typography>
        </Box>
        <Box sx={{ marginLeft: 3, marginTop: 2, flexDirection: "row" }}>
          <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <Box sx={{ fontSize: "25px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
              <Rating name="read-only" size="relative" value={rating} sx={{}} readOnly />
              <List
                sx={{ display: "flex", flexDirection: "row", marginTop: "0px", marginBottom: "0px", paddingTop: "0px" }}
              >
                <ListItemText
                  sx={{ paddingLeft: "1em", marginTop: "0px", marginBottom: "0px", paddingTop: "0px" }}
                  primary={"Cooking Time"}
                  secondary={`${recipe.readyInMinutes} minutes`}
                ></ListItemText>
                <ListItemText
                  sx={{ paddingLeft: "1em", marginTop: "0px", marginBottom: "0px", paddingTop: "0px" }}
                  primary={"Serving"}
                  secondary={`${recipe.servings}`}
                ></ListItemText>
              </List>
            </Box>
            <Box sx={{ display: "flex" }}>
              {favourited === false ? (
                <IconButton
                  size="large"
                  sx={{ marginRight: 3, marginLeft: 6 }}
                  selected={favourited}
                  onClick={() => {
                    onFavourite(recipe);
                  }}
                >
                  <StarIcon fontSize="large" />
                </IconButton>
              ) : (
                <Typography
                  variant="h5"
                  color="orange"
                  sx={{ marginLeft: 6, whiteSpace: "nowrap", display: "inline-block", marginBottom: 2 }}
                >
                  Favourited
                </Typography>
              )}
            </Box>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box>
                <img
                  style={{
                    height: "50vh",
                    width: "65vh",
                    borderRadius: "1em",
                    boxShadow: "inherit",
                  }}
                  src={recipe.image}
                ></img>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-start", paddingTop: "1vh", paddingBottom: "1vh" }}>
                {!loading &&
                  diets.map((item) => (
                    <Chip sx={{ marginRight: "1vh" }} key={item} variant="outlined" label={item}></Chip>
                  ))}
              </Box>
            </Box>

            <Box sx={{ padding: "2vh" }}>
              <Demo>
                <List>
                  {!loading &&
                    recipe.nutrition.nutrients
                      .filter(
                        (nutrient) =>
                          nutrient.name === "Calories" ||
                          nutrient.name === "Fat" ||
                          nutrient.name === "Saturated Fat" ||
                          nutrient.name === "Carbohydrates" ||
                          nutrient.name === "Protein" ||
                          nutrient.name === "Sugar"
                      )
                      .map((item) => (
                        <ListItem key={item.name}>
                          <ListItemText primary={item.name} secondary={`${item.amount} ${item.unit}`} sx={{}} />
                        </ListItem>
                      ))}
                </List>
              </Demo>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            padding: "2vh",
            display: "flex",
            flexGrow: 1,
            flexDirection: "row",
            height: "70vh",
            borderRadius: "1em",
            borderColor: "#eaeaea",
            borderWidth: "1vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              width: "25%",
              flexDirection: "column",
              backgroundColor: "#eaeaea",
              borderRadius: "1em",
            }}
          >
            <Box sx={{ marginLeft: "1.5vh" }}>
              <Typography sx={{}} variant="h4">
                Ingredients
              </Typography>
            </Box>
            <Box sx={{ overflowY: "auto" }}>
              <List>
                {!loading &&
                  ingredients.map((item) => (
                    <ListItem sx={{ padding: "1vh" }} key={item.id}>
                      <ListItemText primary={item.name} secondary={`${item.amount} ${item.unit}`}></ListItemText>
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "70%",
            }}
          >
            <Box sx={{ marginLeft: "1.5vh" }}>
              <Typography sx={{}} variant="h4">
                Method
              </Typography>
            </Box>
            <Box
              sx={{
                overflowY: "auto",
              }}
            >
              <List>
                {!loading &&
                  method.map((item) => (
                    <ListItem key={item.number}>
                      <ListItemText primary={`${item.number}. ${item.step}`}></ListItemText>
                    </ListItem>
                  ))}
              </List>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Recipe;
