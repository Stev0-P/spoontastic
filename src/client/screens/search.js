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
  const [submitted, setSubmitted] = useState(false);

  const [dietFilter, setDietFilter] = React.useState(activeUser.diet);
  const [type, setType] = React.useState("");

  const [intolerances, setIntolerances] = React.useState("");
  const [intolerancesFilter, setIntolerancesFilter] = React.useState([]);

  const [maxReadyTime, setMaxReadyTime] = React.useState(180);

  const [minCalories, setMinCalories] = React.useState(10);
  const [maxCalories, setMaxCalories] = React.useState(2000);

  const [minProtein, setMinProtein] = React.useState(10);
  const [maxProtein, setMaxProtein] = React.useState(250);

  const [minCarbs, setMinCarbs] = React.useState(10);
  const [maxCarbs, setMaxCarbs] = React.useState(250);

  const [minFat, setMinFat] = React.useState(10);
  const [maxFat, setMaxFat] = React.useState(250);

  const sendDiet = (dietFilter) => {
    // the callback. Use a better name
    setDietFilter(dietFilter);
    // console.log(dietFilter);
  };

  const sendType = (typeFilter) => {
    // the callback. Use a better name
    setType(typeFilter);
    //  console.log(typeFilter);
  };

  const sendIntolerances = (intolerancesFilter) => {
    // the callback. Use a better name
    setIntolerancesFilter(intolerancesFilter);
    let stringIntol = intolerancesFilter.toString();
    setIntolerances(stringIntol);
  };

  const sendReadyTime = (maxReadyTime) => {
    // the callback. Use a better name
    setMaxReadyTime(maxReadyTime);
  };

  const sendMinCalories = (minCalories) => {
    // the callback. Use a better name
    setMinCalories(minCalories);
  };
  const sendMaxCalories = (maxCalories) => {
    // the callback. Use a better name
    setMaxCalories(maxCalories);
  };
  const sendMinProtein = (minProtein) => {
    // the callback. Use a better name
    setMinProtein(minProtein);
  };
  const sendMaxProtein = (maxProtein) => {
    // the callback.
    setMaxProtein(maxProtein);
  };

  const sendMinCarbs = (minCarbs) => {
    // the callback.
    setMinCarbs(minCarbs);
  };
  const sendMaxCarbs = (maxCarbs) => {
    // the callback.
    setMaxCarbs(maxCarbs);
  };

  const sendMinFat = (minFat) => {
    // the callback.
    setMinFat(minFat);
  };

  const sendMaxFat = (maxFat) => {
    // the callback.
    setMaxFat(maxFat);
  };

  const sendSubmitted = (submitted) => {
    setSubmitted(submitted);
    //console.log(submitted);
  };
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
    setSubmitted(false);

    const fetchApi = async () => {
      try {
        const { data: response } = await axios.get("/api/recipes/search/", {
          params: {
            userQuery: search,
            diet: dietFilter,
            intolerances: activeUser.intolerances || intolerances,
            type: type,
            maxReadyTime: maxReadyTime,
            minCalories: minCalories,
            maxCalories: maxCalories,
            minProtein: minProtein,
            maxProtein: maxProtein,
            minCarbs: minCarbs,
            maxCarbs: maxCarbs,
            minFat: minFat,
            maxFat: maxFat,
          },
        });
        setRecipes(response);
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };

    fetchApi();
  }, [time.type, search, submitted]);

  return (
    <Box sx={{ flexGrow: 1, marginLeft: { xs: "10vh", md: "18vh" } }}>
      <Typography sx={{ padding: 1 }} variant={"h4"}>
        Search
      </Typography>
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Box
          sx={{
            flexGrow: 1,

            marginRight: 2,
            display: "flex",
            flexDirection: "row",
            width: { xs: "85", lg: "65%" },
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
          <FilterDrawer
            sendDiet={sendDiet}
            sendIntolerances={sendIntolerances}
            sendType={sendType}
            sendReadyTime={sendReadyTime}
            sendMinCalories={sendMinCalories}
            sendMaxCalories={sendMaxCalories}
            sendMinProtein={sendMinProtein}
            sendMaxProtein={sendMaxProtein}
            sendMinCarbs={sendMinCarbs}
            sendMaxCarbs={sendMaxCarbs}
            sendMinFat={sendMinFat}
            sendMaxFat={sendMaxFat}
            sendSubmitted={sendSubmitted}
          />
        </Box>
      </Box>
      <Box>
        {loading === false ? (
          <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
              {recipes.map((item) => (
                <Grid item key={item.id}>
                  <Widget recipe={item} loading={loading} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : (
          <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
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

export default Search;
