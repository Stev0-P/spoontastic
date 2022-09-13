import React, { useEffect, useContext } from "react";
import Container from "@mui/material/Container";
import CheckBox from "../components/CheckBox";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";

const Preferences = () => {
  const styler = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "40vh",
    fontSize: "1.5em",
    textAlign: "center",
  };

  return (
    <Container maxWidth="md" sx={{ paddingBottom: "1em" }}>
      <div style={styler}>
        <div>
          <h1>Welcome to Spoontastic!</h1>
          <h2>
            Please Select Your
            <br /> Dietary Preferences
          </h2>
        </div>
      </div>
      <Box>
        <hr />
        <hr />
        <CheckBox />
      </Box>
    </Container>
  );
};

export default Preferences;
