import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import { fontSize, textAlign } from '@mui/system';
import { Container } from '@mui/material';


const CheckBox = () => {

    const [diet, setDiet] = React.useState('');
    const [intolerance, setIntolerance] = React.useState({});

    const dietChange = (event) => {
        setDiet(event.target.value);
    };

    const intoleranceChange = (event) => {
        setIntolerance((prevState) => ({
            ...prevState,
            [event.target.value]: !prevState[event.target.value],
        }))
    };

    console.log(diet)

    console.log(intolerance)

    return (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: 1000, height: 300 }}>
            <FormControl style={{ display: 'flex', flexDirection: 'row' }}>

                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="regular"
                    name="radio-buttons-group"
                    value={diet}
                    onChange={dietChange}
                    style={{ paddingRight: '10em' }}


                >
                    <FormLabel style={{ color: 'black', fontSize: '1.5em' }}>Diet</FormLabel>
                    <Box>
                        <FormControlLabel value="regular" control={<Radio style={{ color: 'black' }} />} label="Regular" />
                        <FormControlLabel value="glutenFree" control={<Radio style={{ color: 'black' }} />} label="Gluten Free" />
                        <FormControlLabel value="ketogenic" control={<Radio style={{ color: 'black' }} />} label="Ketogenic" />
                        <FormControlLabel value="vegetarian" control={<Radio style={{ color: 'black' }} />} label="Vegetarian" />
                        <FormControlLabel value="lactoVegetarian" control={<Radio style={{ color: 'black' }} />} label="Lacto-Vegetarian" />
                        <FormControlLabel value="ovoVegetarian" control={<Radio style={{ color: 'black' }} />} label="Ovo-Vegetarian" />
                        <FormControlLabel value="vegan" control={<Radio style={{ color: 'black' }} />} label="Vegan" />
                        <FormControlLabel value="pescetarian" control={<Radio style={{ color: 'black' }} />} label="Pescetarian" />
                        <FormControlLabel value="paleo" control={<Radio style={{ color: 'black' }} />} label="Paleo" />
                        <FormControlLabel value="primal" control={<Radio style={{ color: 'black' }} />} label="Primal" />
                        <FormControlLabel value="lowFodmap" control={<Radio style={{ color: 'black' }} />} label="Low FODMAP" />
                        <FormControlLabel value="whole30" control={<Radio style={{ color: 'black' }} />} label="Whole30" />
                    </Box>
                </RadioGroup>
            </FormControl>

            <FormControl style={{ display: 'flex', flexDirection: 'row' }}>
                <FormGroup
                    defaultValue="regular"
                    value={intolerance}
                    onChange={intoleranceChange}
                    style={{ paddingRight: '10em' }}

                >
                    <FormLabel style={{ color: 'black', fontSize: '1.5em' }}>Intolerences</FormLabel>
                    <Box>
                        <FormControlLabel control={<Checkbox value="dairy" />} label="Dairy" />
                        <FormControlLabel control={<Checkbox value="egg" />} label="Egg" />
                        <FormControlLabel control={<Checkbox value="gluten" />} label="Gluten" />
                        <FormControlLabel control={<Checkbox value="grain" />} label="Grain" />
                        <FormControlLabel control={<Checkbox value="peanut" />} label="Peanut" />
                        <FormControlLabel control={<Checkbox value="seafood" />} label="Seafood" />
                        <FormControlLabel control={<Checkbox value="sesame" />} label="Sesame" />
                        <FormControlLabel control={<Checkbox value="shellfish" />} label="Shellfish" />
                        <FormControlLabel control={<Checkbox value="soy" />} label="Soy" />
                        <FormControlLabel control={<Checkbox value="sulfite" />} label="Sulfite" />
                        <FormControlLabel control={<Checkbox value="tree-nut" />} label="Tree Nut" />
                        <FormControlLabel control={<Checkbox value="wheat" />} label="Wheat" />
                    </Box>
                </FormGroup>
            </FormControl>
        </Box>
    );
};

export default CheckBox;