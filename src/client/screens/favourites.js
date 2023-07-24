import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../components/SearchBar";
import useRecipes from "../hooks/useRecipes";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import FavouritesList from "../components/FavouritesList";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import useTime from "../hooks/useTime";
import { Grid } from "@mui/material";
import axios from "axios";
import Widget from "../components/Widget";

const Favourites = () => {
  const history = useHistory();
  const location = useLocation();
  const activeUser = useContext(UserContext);
  const [dense, setDense] = useState(false);
  const time = useTime();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourited, setFavourited] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [recNo, setRecNo] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        // When hooks update if(activeUser.favourites === null) {
        const { data: response } = await axios.get(`/api/favourites/${activeUser.userId}`);
        if (response.recipe.length === 0) {
          setRecNo(false);
          setRecipes([]);
        } else {
          setRecNo(true);
          setRecipes(response.recipe);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    })();

    return () => controller.abort();
  }, [time.type, deleted]);

  const onDelete = (item) => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete(`/api/favourites/delete/${item.recipeID}`);
        setDeleted((prevState) => prevState + 1);
        //console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  return (
    <Box sx={{ flexGrow: 1, marginLeft: { xs: "10vh", md: "18vh" } }}>
      <div style={{ marginLeft: "1em" }}>
        <h2>Your Favourite Recipes</h2>
      </div>
      <Box>
        {loading === false ? (
          <Box sx={{ marginTop: "1.5%" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {recipes.map((item) => (
                <Grid item key={item.id}>
                  <Widget recipe={item} loading={loading} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ marginTop: "1.5%" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {[...Array(12)].map((_, i) => (
                <Grid item key={i}>
                  <Widget recipe={i} loading={true} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Favourites;
