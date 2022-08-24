import React from "react";
import { Box, Typography, Chip, Container } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import { useContext, useEffect } from "react";
import useTime from "../hooks/useTime";
import axios from "axios";

const Widget = () => {
  const user = useContext(UserContext);
  const [recipeTitle, setRecipeTitle] = React.useState("");
  const [recipeImage, setRecipeImage] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const time = useTime();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get("/api/recipes/random/", {
          params: {
            mealType: time.type,
            userDiet: user.diet,
            userIntolerances: user.intolerances,
          },
        });
        setRecipeTitle(response.recipes[0].title);
        setRecipeImage(response.recipes[0].image);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchApi();
  }, [time.type]);

  const NumberOfRecipes = () => {
    return (
      <Box
        sx={{
          borderRadius: "2em",
          width: "200px",
          height: "240px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          backgroundColor: "#f7a05e",
          margin: 3,
          boxShadow: 3,
        }}
      >
        <Typography sx={{ paddingTop: "0.65em", textAlign: "center" }} variant="h6" component="div">
          No. Of Recipes
        </Typography>
        <Box
          sx={{
            textAlign: "center",
            backgroundColor: "#f5efe9",
            boxShadow: 4,
            borderRadius: "2em",
            padding: "0.5em",
            zIndex: 1,
            position: "relative",
            height: "11em",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              justifyContent: "center",
              paddingTop: "11px",
            }}
            variant="h1"
          >
            {5}
          </Typography>
          <Typography sx={{ textAlign: "center", justifyContent: "center" }} variant="h6">
            Current Recipes
          </Typography>
        </Box>
      </Box>
    );
  };

  const MealWidget = () => {
    const history = useHistory();

    return (
      <Box
        sx={{
          borderRadius: "2em",
          width: "200px",
          height: "240px",
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          backgroundColor: "#f7a05e",
          marginRight: 3,
          marginLeft: 3,
          marginTop: 3,
          boxShadow: 3,
        }}
        onClick={() => history.push("/recipe/:id")}
      >
        <Typography sx={{ paddingTop: "0.65em", textAlign: "center" }} variant="h6" component="div">
          Recipe Of The Day
        </Typography>
        <Box
          sx={{
            boxShadow: 4,
            borderRadius: "2em",
            backgroundColor: "#f5efe9",
          }}
        >
          <img
            style={{
              height: "160px",
              width: "200px",
              borderRadius: "2em 2em 0em 0em",
            }}
            src={recipeImage}
          />
          <Typography
            sx={{
              textAlign: "center",
              backgroundColor: "#f5efe9",
              marginTop: -3,
              boxShadow: 4,
              borderRadius: "2em",
              padding: "0.5em",
              zIndex: 1,
              position: "relative",
              height: "32px",
            }}
            variant="h7"
            component="div"
          >
            {recipeTitle}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <MealWidget />
      {NumberOfRecipes()}
    </Box>
  );
};

export default Widget;
