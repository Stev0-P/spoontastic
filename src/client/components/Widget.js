import React from "react";
import { Box, Typography, Chip, Container } from "@mui/material";
import { useHistory, useLocation } from "react-router-dom";
import zIndex from "@mui/material/styles/zIndex";

const Widget = () => {
  const itemsList = [
    {
      description: "Lemon Herb Grilled Salmon",
      img: "https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80",
      route: "/recipe:id",
    },
    {
      description: "Buffalo Wings",
      img: "https://img.freepik.com/free-photo/delicious-fried-chicken-plate_144627-27379.jpg?t=st=1659444439~exp=1659445039~hmac=c5ed5f3cda87a715afd6430bd6132bf1c0a85569b58728b5d39229e69dcd0318",
      route: "/recipe:id",
    },
    {
      description: "Rizzoto Pasta",
      img: "https://img.freepik.com/free-photo/penne-pasta-tomato-sauce-with-chicken-tomatoes-wooden-table_2829-19739.jpg?&t=st=1659444485~exp=1659445085~hmac=aa7de2e42b79825cc04bf17eec6c034db604757b465907c0c0a5ebc5df72d11a",
      route: "/recipe:id",
    },
  ];

  const rotd = "Recipe Of The Day";
  const favMeal = "Favourite Recipe";

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
        <Typography
          sx={{ paddingTop: "0.65em", textAlign: "center" }}
          variant="h6"
          component="div"
        >
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
            {itemsList.length}
          </Typography>
          <Typography
            sx={{ textAlign: "center", justifyContent: "center" }}
            variant="h6"
          >
            Current Recipes
          </Typography>
        </Box>
      </Box>
    );
  };

  const MealWidget = (number, text) => {
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
        <Typography
          sx={{ paddingTop: "0.65em", textAlign: "center" }}
          variant="h6"
          component="div"
        >
          {text}
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
            src={itemsList[number].img}
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
            {itemsList[number].description}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {MealWidget(0, rotd)}
      {MealWidget(1, favMeal)}
      {NumberOfRecipes()}
    </Box>
  );
};

export default Widget;
