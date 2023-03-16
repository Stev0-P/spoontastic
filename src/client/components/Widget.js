import React from "react";

import {
  Box,
  Typography,
  Chip,
  Container,
  Card,
  CardActions,
  CardMedia,
  CardContent,
  Button,
  List,
  ListItem,
} from "@mui/material";
import EggAltOutlinedIcon from "@mui/icons-material/EggAltOutlined";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import { useContext, useEffect } from "react";
import useTime from "../hooks/useTime";
import axios from "axios";
import { Scale } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Widget = () => {
  const activeUser = useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const time = useTime();

  const [recipe, setRecipe] = React.useState({});
  const [diets, setDiets] = React.useState([]);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const { data: recipe } = await axios.get("/api/recipes/random/", {
          params: {
            diet: activeUser.diet,
            intolerance: activeUser.intolerance,
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

  /*

  const TimeOfDay = () => {
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
          Time of Day:
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
          {time.type === "breakfast" ? (
            <Box sx={{ paddingTop: "0.7em" }}>
              <Box sx={{ fontSize: "100px" }}>
                <EggAltOutlinedIcon fontSize="inherit" />
              </Box>
              <Typography sx={{ textAlign: "center" }} variant="h6" component="div">
                Breakfast
              </Typography>
            </Box>
          ) : (
            ""
          )}
          {time.type === "appetizer" ? (
            <Box sx={{ paddingTop: "0.7em" }}>
              <Box sx={{ fontSize: "100px" }}>
                <LunchDiningIcon fontSize="inherit" />
              </Box>
              <Typography sx={{ textAlign: "center" }} variant="h6" component="div">
                Lunch
              </Typography>
            </Box>
          ) : (
            ""
          )}
          {time.type === "main course" ? (
            <Box sx={{ paddingTop: "0.7em" }}>
              <Box sx={{ fontSize: "100px" }}>
                <DinnerDiningIcon fontSize="inherit" />
              </Box>
              <Typography sx={{ textAlign: "center" }} variant="h6" component="div">
                Dinner
              </Typography>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Box>
    );
  };
  */
  /*

  const UserName = () => {
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
          Current User:
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
              allignText: "wrap",
              allignItems: "center",
              paddingTop: "60px",
            }}
            variant="h5"
          >
            {activeUser.name}
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              justifyContent: "center",
              allignText: "wrap",
              allignItems: "center",
              paddingTop: "20px",
            }}
            variant="h7"
          >
            Diet: {activeUser.diet}
          </Typography>
        </Box>
      </Box>
    );
  };
*/
  const MealWidget = () => {
    const history = useHistory();

    return (
      <Box
        sx={{
          borderRadius: "8px",
          width: "350px",

          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          backgroundColor: "#f6f5f4",
          marginRight: "1.5%",
          marginLeft: "1.5%",
          marginTop: "1.5%",
          boxShadow: 3,
        }}
        onClick={() => history.push(`/recipe/${recipe.id}`)} //history.push("/recipe/:id")
      >
        {loading === false && recipe ? (
          <Box>
            <img
              style={{
                height: "250px",
                width: "350px",
                borderRadius: "8px 8px 0 0",
              }}
              src={recipe.image}
            />
            <Box sx={{ padding: "8px" }}>
              <Typography sx={{}} variant="h6" component="div">
                {recipe.title}
              </Typography>
              <Box sx={{ flexDirection: "column", display: "flex" }}>
                <Box sx={{ flexDirection: "row", display: "flex", marginTop: "12px" }}>
                  <AccessTimeIcon />
                  <Typography variant="body2=" sx={{ paddingLeft: "5px" }}>
                    {recipe.readyInMinutes} minutes
                  </Typography>
                </Box>
                <Box sx={{ marginTop: "8px" }}>
                  <Typography variant="body2=">Servings: {recipe.servings} </Typography>
                </Box>

                <Box sx={{ flexDirection: "row", display: "flex", marginTop: "8px", overflowY: "auto" }}>
                  {loading === false &&
                    diets.map((item) => <Chip sx={{ marginRight: "5px" }} variant="outlined" label={item}></Chip>)}
                </Box>
              </Box>
            </Box>
          </Box>
        ) : (
          ""
        )}
      </Box>
    );

    /*

    return (
      <Card sx={{ maxWidth: 345 }}>
        <CardContent>
          <CardMedia />
          <Typography gutterBottom variant="h5" component="div">
            Lizard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents
            except Antarctica
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Share</Button>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    );
    */
  };

  // {UserName()}
  //{TimeOfDay()}

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
      <MealWidget />
    </Box>
  );
};

export default Widget;
