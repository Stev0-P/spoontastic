import React from "react";
import Container from '@mui/material/Container';
import CheckBox from "../components/CheckBox";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Preferences = () => {
    const styler = {
        display: 'flex',
        alignItems: 'left',
        justifyContent: '',
        height: '40vh',
        fontSize: '1.5em',
    };


    return (
        <Container maxWidth='md'>
            <div style={styler}>
                <div>
                    <h1>Welcome,</h1>
                    <h1>Please Select Your<br /> Dietary Preferences</h1>
                </div>
            </div>
            <Box>
                <hr />
                <hr />
                <CheckBox />
            </Box>
            <Button variant="contained" onClick={()=> window.location.href = "/dashboard"}>
                Submit
            </Button >
        </Container>

    );
}

export default Preferences;