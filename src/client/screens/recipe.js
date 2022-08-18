import React from "react";
import { Box } from "@mui/system";
import { Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const macrosList = [
  {
    name: "Calories",
    amount: "438",
  },
  {
    name: "Protein",
    amount: "18g",
  },
  {
    name: "Fat",
    amount: "6g",
  },
  {
    name: "Saturated Fat",
    amount: "2g",
  },
  {
    name: "Carbohydrates",
    amount: "49g",
  },
];

const ingredientsList = [
  {
    name: "1 tbsp butter",
    id: 1,
  },
  {
    name: "2 Lemons",
    id: 2,
  },
  {
    name: "Fish",
    id: 3,
  },
  {
    name: "Seasonings",
    id: 4,
  },
  {
    name: "Oven 30-min",
    id: 5,
  },
];
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: "white",
}));

const Recipe = () => {
  const history = useHistory();
  const location = useLocation();
  const recipeID = location.pathname.split("/").pop();
  //console.log(recipeID);
  const [recipe, setRecipe] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get(`/api/recipes/item/${recipeID}`);
        setRecipe(response);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchApi();
  }, []);
  console.log(recipe);

  const filteredNutrients =
    !loading &&
    recipe.nutrition.nutrients.filter((nutrient) => {
      return nutrient.name === "Protein" && nutrient.name === "Calories";
    });

  console.log(filteredNutrients);

  return (
    <Box sx={{ display: " flex", flexDirection: "column" }}>
      <Box sx={{ marginLeft: 3, marginTop: 4 }}>
        <Typography variant="h3">{recipe.title}</Typography>
      </Box>
      <Box sx={{ marginLeft: 3, marginTop: 2, flexDirection: "row" }}>
        <Box>
          <Rating name="read-only" size="large" value={4} readOnly />
        </Box>
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
                  recipe.nutrition.nutrients.map((item) => (
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
          <Box sx={{ marginLeft: "5%" }}>
            <Demo sx={{ borderRadius: "1em" }}>
              <List>
                {!loading &&
                  recipe.nutrition.properties.map((item) => (
                    <ListItem
                      key={item.id}
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
          <Typography variant="body1">{recipe.instructions}</Typography>
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
