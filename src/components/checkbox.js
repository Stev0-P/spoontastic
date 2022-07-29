import React from 'react';
import  FormControl  from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { fontSize } from '@mui/system';


const CheckBox = () => {
  
  return (
      <FormControl>
      <FormLabel id="demo-radio-buttons-group-label" style={{color: 'black', fontSize: '1.5em'}}>Diet</FormLabel>
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue="female"
        name="radio-buttons-group"
      >
        <FormControlLabel value="regular" control={<Radio style={{color: 'black'}}/>} label="Regular" />
        <FormControlLabel value="vegan" control={<Radio style={{color: 'black'}} />} label="Vegan" />
        <FormControlLabel value="primal" control={<Radio style={{color: 'black'}} />} label="Primal" />
      </RadioGroup>
    </FormControl>
   

  );
};

export default CheckBox;