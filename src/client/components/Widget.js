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
  Skeleton,
  Stack,
} from "@mui/material";
import EggAltOutlinedIcon from "@mui/icons-material/EggAltOutlined";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import { useContext, useEffect, useState } from "react";
import useTime from "../hooks/useTime";
import axios from "axios";
import { Scale } from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const Widget = (props) => {
  const activeUser = useContext(UserContext);
  const [favourites, setFavourites] = React.useState([]);
  const [noMatch, setNotMatched] = useState(false);

  useEffect(() => {
    console.log(props.recipe);
    console.log(window.location.pathname.split("/"));
  }, [props]);
  const MealWidget = () => {
    const history = useHistory();

    return (
      <Box
        sx={{
          borderRadius: "2vh",
          width: "35vh",

          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          backgroundColor: "#f6f5f4",
          marginRight: "1.5%",

          marginTop: "1.5%",

          boxShadow: 3,
        }}
      >
        <Box
          onClick={() => history.push(`/recipe/${props.recipe.recipeID || props.recipe.id}`)} //history.push("/recipe/:id")
        >
          {props.loading === false && props.recipe ? (
            <Box>
              <img
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: "8px 8px 0 0",
                }}
                src={props.recipe.image}
              />

              <Box sx={{ padding: "8px" }}>
                <Typography sx={{ height: "12vh" }} variant="h6" component="div">
                  {props.recipe.title}
                </Typography>
                {props.recipe.readyInMinutes != null ? (
                  <Box sx={{ flexDirection: "column", display: "flex" }}>
                    <Box sx={{ flexDirection: "row", display: "flex", marginTop: "12px" }}>
                      <AccessTimeIcon />
                      <Typography variant="body2=" sx={{ paddingLeft: "5px" }}>
                        {props.recipe.readyInMinutes} minutes
                      </Typography>
                    </Box>
                    <Box sx={{ marginTop: "8px" }}>
                      <Typography variant="body2=">Servings: {props.recipe.servings} </Typography>
                    </Box>
                    <Box
                      sx={{ flexDirection: "row", display: "flex", marginTop: "8px", overflowY: "auto" }}
                      className="example"
                    >
                      {props.loading === false &&
                        props.recipe.diets.map((item) => (
                          <Chip sx={{ marginRight: "5px" }} variant="outlined" label={item}></Chip>
                        ))}
                    </Box>
                  </Box>
                ) : (
                  <Box> </Box>
                )}
              </Box>
            </Box>
          ) : (
            <Box>
              <Skeleton variant="rectangular" width={"35vh"} height={"250px"} />
              <Box sx={{}}>
                <Skeleton />
                <Skeleton width="60%" />
              </Box>
            </Box>
          )}
        </Box>
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
