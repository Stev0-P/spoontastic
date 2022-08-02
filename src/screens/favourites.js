import React, { useState, useEffect } from "react";
import SearchBar from '../components/SearchBar';
import useRecipes from '../hooks/useRecipes';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Favourites = () => {
    const [recipes, search] = useRecipes('Pasta');

    const styler = {
        display: 'flex',
        alignItems: 'left',
        justifyContent: '',
        height: '40vh',
        fontSize: '1.5em',
    };

    return (
        <Container maxWidth='lg'>
            <div style={styler}>
                <div>
                    <h2>Your Favourite Recipes</h2>
                    <SearchBar onFormSubmit={search} />
                </div>
            </div>
        </Container>
    );
}

export default Favourites;