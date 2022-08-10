import React, { useState, useEffect } from "react";
import SearchBar from '../components/SearchBar';
import useRecipes from '../hooks/useRecipes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import RecipeList from "../components/RecipeList";



const Favourites = () => {
    const [recipes, search] = useRecipes('Pasta');


    return (
        
            <Box sx={{flexGrow: 1}}>
                <div style={{marginLeft: '1em'}}>
                    <h2>Your Favourite Recipes</h2>
                </div>
                    <SearchBar onFormSubmit={search} />
                    <RecipeList label="Favourites"/>
               
            </Box>
    );
}

export default Favourites;