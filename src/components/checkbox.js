import React from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { fontSize, textAlign } from '@mui/system';
import { Container } from '@mui/material';


const CheckBox = () => {

    const [diet, setDiet] = React.useState('');
    const [intolerance, setIntolerance] = React.useState('');

    const dietChange = (event) => {
        setDiet(event.target.value);
    };

    const intoleranceChange = (event) => {
        setIntolerance(event.target.value);
    };



console.log(diet)

console.log(intolerance)
    return (

        <FormControl style={{display: 'flex' , flexDirection: 'row' }}>
            
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="regular"
                name="radio-buttons-group"
                value={diet}
                onChange={dietChange}
                style={{paddingRight: '10em'}}
                
                
            >
                <FormLabel id="demo-radio-buttons-group-label" style={{ color: 'black', fontSize: '1.5em'}}>Diet</FormLabel>
                <FormControlLabel value="regular" control={<Radio style={{ color: 'black' }} />} label="Regular" />
                <FormControlLabel value="vegan" control={<Radio style={{ color: 'black' }} />} label="Vegan" />
                <FormControlLabel value="primal" control={<Radio style={{ color: 'black' }} />} label="Primal" />
            </RadioGroup>



            
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
                value={intolerance}
                onChange={intoleranceChange}
              
            >
                <FormLabel id="demo-radio-buttons-group-label" style={{ color: 'black', fontSize: '1.5em'}}>Intolerances</FormLabel>
                <FormControlLabel value="dairy" control={<Radio style={{ color: 'black' }} />} label="Dairy" />
                <FormControlLabel value="gluten" control={<Radio style={{ color: 'black' }} />} label="Gluten" />
                <FormControlLabel value="soy" control={<Radio style={{ color: 'black' }} />} label="Soy" />
            </RadioGroup>

        </FormControl>

    );
};

export default CheckBox;