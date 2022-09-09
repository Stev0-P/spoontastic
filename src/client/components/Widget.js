import React from "react";
import { Box, Typography, Chip, Container } from "@mui/material";
import EggAltOutlinedIcon from "@mui/icons-material/EggAltOutlined";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import { useContext, useEffect } from "react";
import useTime from "../hooks/useTime";
import axios from "axios";
import { Scale } from "@mui/icons-material";

const Widget = () => {
  const activeUser = useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const time = useTime();

  const [recipe, setRecipe] = React.useState({});

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
        console.log(recipe)
      } catch (err) {
        console.log(err);
      }
    })();

    return () => controller.abort();
  }, []);

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
                Lunch
              </Typography>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Box>
    );
  };

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
        onClick={() => history.push(`/recipe/${recipe.id}`)} //history.push("/recipe/:id")
      >
        <Typography sx={{ paddingTop: "0.65em", textAlign: "center" }} variant="h6" component="div">
          Random Recipe
        </Typography>

        {loading === false && recipe ? (
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
              src={recipe.image}
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
              {recipe.title}
            </Typography>
          </Box>
        ) : (
          ""
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <MealWidget />
      {UserName()}
      {TimeOfDay()}
    </Box>
  );
};

export default Widget;
