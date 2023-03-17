import React, { useEffect, useContext } from "react";
import { ListItem, Typography, List, Grid } from "@mui/material";
import RecipeList from "../components/RecipeList";
import Container from "@mui/material/Container";
import DashboardWidgets from "../client/components/DashboardWidgets";
import { Box } from "@mui/system";
import Widget from "../components/Widget";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import useTime from "../hooks/useTime";
import axios from "axios";

const Dashboard = () => {
  const activeUser = useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const time = useTime();

  const [recipe, setRecipe] = React.useState({});
  const [diets, setDiets] = React.useState([]);

  const [recipesList, setRecipesList] = React.useState([]);
  //get single random recipe
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: recipe } = await axios.get("/api/recipes/random/", {
          params: {
            diet: activeUser.diet,
            intolerance: activeUser.intolerance,
            num: "1",
          },
        });
        setLoading(false);
        setRecipe(recipe.recipes[0]);
        setDiets(recipe.recipes[0].diets);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => controller.abort();
  }, []);
  //get reccomended recipes

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: list } = await axios.get("/api/recipes/random/", {
          params: {
            diet: activeUser.diet,
            intolerance: activeUser.intolerance,
            num: "12",
          },
        });
        setLoading(false);
        setRecipesList(list.recipes);
        //   setDiets(recipe.recipes[0].diets);
      } catch (err) {
        console.log(err);
      }
    })();

    return () => controller.abort();
  }, []);
  /*
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: response } = await axios.get("/api/recipes/", {
          params: {
            mealType: time.type,
            userDiet: activeUser.diet,
            userIntolerances: activeUser.intolerance,
          },
        });

        setRecipesList(response);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();
    console.log(recipesList);
    return () => controller.abort();
  }, [time.type]);
*/
  //<RecipeList label="Recommended" />
  const history = useHistory();
  const location = useLocation();
  /* <List>
        {!loading &&
          recipesList.map((item) => (
            <ListItem key={item.id}>
              <Widget recipe={item} loading={loading} />
            </ListItem>
          ))}
      </List>*/
  console.log(recipesList);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, marginLeft: "13%" }}>
      <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
        <Typography variant="h4">We Recommend:</Typography>
      </Box>
      <Widget recipe={recipe} loading={loading} diets={diets} />
      <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
        <Typography variant="h4">Recommended {time.text}</Typography>
      </Box>
      <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {!loading &&
            recipesList.map((item) => (
              <Grid item key={item.id}>
                <Widget recipe={item} loading={loading} diets={item.diets} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
