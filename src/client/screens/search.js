import React, { useState, useEffect, useContext } from "react";
import SearchBar from "../components/SearchBar";
import useRecipes from "../hooks/useRecipes";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import RecipeList from "../components/RecipeList";
import { Grid, Typography } from "@mui/material";
import axios from "axios";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import SearchList from "../components/SearchList";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";
import useTime from "../hooks/useTime";
import Widget from "../components/Widget";
import FilterDrawer from "../components/FilterDrawer";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
  const history = useHistory();
  const location = useLocation();
  const activeUser = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourited, setFavourited] = useState(false);
  const [favourites, setFavourites] = useState([]);
  const time = useTime();

  //const time = useTime();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      //console.log(searchTerm)
      // Send Axios request here
      //setSearch(searchTerm);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSubmit = (event) => {
    // 👇️ prevent page refresh
    event.preventDefault();
    event.stopPropagation();
    setSearch(searchTerm);
  };

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get("/api/recipes/search/", {
          params: {
            userQuery: search,
          },
        });
        setRecipes(response);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchApi();
  }, [time.type, search]);
  /* <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {!loading &&
            recipes.map((item) => (
              <Grid item key={item.id}>
                <Widget recipe={item} loading={loading} />
              </Grid>
            ))}
        </Grid>*/

  return (
    <Box sx={{ flexGrow: 1, marginLeft: "13%" }}>
      <Typography sx={{ padding: 2 }} variant={"h4"}>
        Search
      </Typography>
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: 2,
            marginRight: 2,
            display: "flex",
            flexDirection: "row",
            width: "65%",
          }}
        >
          <TextField
            fullWidth
            label="Search"
            id="input-with-icon-textfield"
            placeholder="Eg. Spaghetti Bolognase, Club Sandwich, Homemade Beef Burgers"
            type="text"
            variant="filled"
            color="success"
            sx={{ borderRadius: "15%" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FilterDrawer />
        </Box>
      </Box>

      <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {!loading &&
            recipes.map((item) => (
              <Grid item key={item.id}>
                <Widget recipe={item} loading={loading} />
              </Grid>
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Search;
