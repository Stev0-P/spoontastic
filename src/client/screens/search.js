import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import useRecipes from "../hooks/useRecipes";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import RecipeList from "../components/RecipeList";
import axios from "axios";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import SearchList from "../components/SearchList";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [search, setSearch] = useState("");
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
    console.log("form submitted ✅");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <div style={{ marginLeft: "1em" }}>
        <h2>Search</h2>
      </div>
      <Box component="form" autoComplete="off" onSubmit={handleSubmit}>
        <Box
          sx={{
            flexGrow: 1,
            marginLeft: 2,
            marginRight: 2,
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
        </Box>
      </Box>
      <SearchList label="Recomended" query={search} />
    </Box>
  );
};

export default Search;
