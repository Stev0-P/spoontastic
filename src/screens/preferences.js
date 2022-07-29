import React from "react";
import Container from '@mui/material/Container';
import CheckBox from "../components/checkbox";



const Preferences = () => {
    const styler = {
        display: 'flex',
        alignItems: 'left',
        justifyContent: '',
        height: '40vh',
        fontSize: '1.5em',
    };


    return (
        <Container maxWidth = 'md'>
        <div style={styler}>
            <div>
                <h1>Welcome,</h1>
                <h1>Please Select Your<br /> Dietary Preferences</h1>
            </div>
        </div>
        <div style={{maxWidth: "50%" }}>
        <hr />
        <hr />
        </div>
        <div>
        <CheckBox />
        </div>
        </Container>
       
        
       
    );
}

export default Preferences;