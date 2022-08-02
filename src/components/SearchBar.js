import React, { useState } from 'react';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';


const SearchBar = ({ onFormSubmit }) => {
    const [term, setTerm] = useState('');

    const onInputChange = event => {
        setTerm(event.target.value);
    };

    const onSubmit = event => {
        event.stopPropagation()
        event.preventDefault();

        onFormSubmit(term);
    }

    return (
        <Box component="form" noValidate autoComplete="off" onSubmit={onSubmit}>
            <Box
                sx={{
                    width: 1000,
                    maxWidth: '100%',
                }}
            >
                <TextField
                    fullWidth
                    label="Search"
                    id="input-with-icon-textfield"
                    placeholder="Eg. Spaghetti Bolognase, Club Sandwich, Homemade Beef Burgers"
                    type="text"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    value={term}
                    onChange={(event) => onInputChange(event)}
                />
            </Box>
        </Box>
    );
};

export default SearchBar