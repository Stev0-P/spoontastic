import React from "react";
import Container from '@mui/material/Container';

const Preferences = () => {
    const styler = {
        display: 'flex',
        alignItems: 'left',
        justifyContent: '',
        height: '40vh',
    };

    return (
        <Container maxWidth="sm">
        <div style={styler}>
            <div>
                <h1>Welcome</h1>
                <br />
                <h1>Please Select Your Dietry Preferences</h1>
            </div>
        </div>
        <hr />
        <hr />
        </Container>

    );
}

export default Preferences;