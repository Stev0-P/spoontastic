import React from "react";
import { Box } from "@mui/system";
import { Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import IconButton from "@mui/material/IconButton";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import axios from "axios";
import UserContext from "../context/User";
import { orange } from '@mui/material/colors';

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
  const [favourited, setFavourited] = useState(false);
  const activeUser = useContext(UserContext);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get(`/api/recipes/item/${recipeID}`);
        setRecipe(response);
        console.log(response);
        ratingScore(response.healthScore);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchApi();
    ratingScore();
  }, []);

  const onFavourite = (item) => {
    const fetchApi = async () => {
      try {
        console.log(item.id);
        const { data: response } = await axios.post("/api/favourites/", {
          title: item.title,
          image: item.image,
          creator: activeUser.userId,
          recipeID: item.id,
        });
        console.log(response);
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
    <Box sx={{ display: " flex", flexDirection: "column" }}>
      <Box sx={{ marginLeft: 3, marginTop: 4 }}>
        <Typography variant="h3">{recipe.title}</Typography>
      </Box>
      <Box sx={{ marginLeft: 3, marginTop: 2, flexDirection: "row" }}>
        <Box>
          <Rating name="read-only" size="large" value={rating} readOnly />
        </Box>
        {favourited === false ? (
          <Box>
            <IconButton
              size="large"
              sx={{ marginRight: 3 }}
              selected={favourited}
              onClick={() => {
                onFavourite(recipe);
              }}
            >
              {" "}
              <StarIcon fontSize="large" />{" "}
            </IconButton>
          </Box>
        ) : (
          <Typography variant="h6" color="orange">Favourited</Typography>
        )}

        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <img
            style={{
              height: "350px",
              width: "450px",
              borderRadius: "1em",
            }}
            src={recipe.image}
          ></img>
          <Box>
            <Demo sx={{ borderRadius: "1em" }}>
              <List>
                {!loading &&
                  recipe.nutrition.nutrients
                    .filter(
                      (nutrient) =>
                        nutrient.name === "Calories" ||
                        nutrient.name === "Fat" ||
                        nutrient.name === "Saturated Fat" ||
                        nutrient.name === "Carbohydrates" ||
                        nutrient.name === "Protein"
                    )
                    .map((item) => (
                      <ListItem
                        key={item.name}
                        sx={{
                          backgroundColor: "#f5efe9",
                          borderRadius: "1em",
                          marginTop: "0.5em",
                          boxShadow: 2,
                          marginLeft: 3,
                        }}
                        disablePadding
                      >
                        <ListItemText
                          primary={item.name}
                          secondary={item.amount}
                          sx={{
                            margin: 0.5,
                            height: "3em",
                            backgroundColor: "#FAFAF9",
                            borderRadius: "1em",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            paddingLeft: "1em",
                            paddingRight: "1em",
                          }}
                        />
                      </ListItem>
                    ))}
              </List>
            </Demo>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              backgroundColor: "#f7a05e",
              borderRadius: "1em",
              marginRight: 4,
              marginLeft: 5,
              marginTop: 3,
              paddingTop: "1em",
            }}
          >
            <Typography sx={{ paddingLeft: "0.525em" }} variant="h4">
              Instructions
            </Typography>
            <Box
              sx={{
                backgroundColor: "#f5efe9",
                borderRadius: "1em",
                paddingTop: "1em",
                paddingLeft: "1.5em",
                height: "100%",
              }}
            >
              <Typography variant="body1">{recipe.instructions}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          backgroundColor: "#f7a05e",
          borderRadius: "1em",
          marginRight: 4,
          marginLeft: 3,
          marginTop: 3,
          paddingTop: "1em",
        }}
      >
        <Typography sx={{ paddingLeft: "0.525em" }} variant="h4">
          Description
        </Typography>
        <Box
          sx={{
            backgroundColor: "#f5efe9",
            borderRadius: "1em",
            paddingTop: "1em",
            paddingLeft: "1.5em",
            paddingBottom: "1.5em",
          }}
        >
          <Typography variant="body1">{recipe.summary}</Typography>
        </Box>
      </Box>
      <Chip
        label="Return"
        variant="outlined"
        color="success"
        onClick={() => history.goBack()}
        sx={{
          fontSize: "1.5em",
          fontWeight: "bold",
          height: "2em",
          borderWidth: "1.75px",
          marginLeft: "35%",
          marginRight: "35%",
          marginTop: "2%",
        }}
      />
    </Box>
  );
};

export default Recipe;
