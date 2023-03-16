import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../components/SearchBar";
import useRecipes from "../hooks/useRecipes";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FavouritesList from "../components/FavouritesList";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";

const Favourites = () => {
  const [recipes, search] = useRecipes("Pasta");
  const history = useHistory();
  const location = useLocation();
  const activeUser = useContext(UserContext);

  useEffect(() => {
    if (activeUser.name === "") {
      history.push("/");
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, marginLeft: "13%" }}>
      <div style={{ marginLeft: "1em" }}>
        <h2>Your Favourite Recipes</h2>
      </div>
      <FavouritesList label="Favourites" />
    </Box>
  );
};

export default Favourites;
