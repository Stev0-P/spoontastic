import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Button, TextField } from "@mui/material";
import UserContext from "..//context/User";
import { useHistory } from "react-router-dom";
import axios from "axios";

export const LogIn = () => {
  const history = useHistory();
  const { userId, setUserId } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleCallbackResponse = async (response) => {
    const { data: res } = await axios.post("/api/account/", {
      JWT: response.credential,
    });

    setUserId(res.user.id);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      /* global google */
      google.accounts.id.initialize({
        client_id: "310796731049-go21cqbgntnb8ld42p9m5gm4odh78487.apps.googleusercontent.com",
        callback: handleCallbackResponse,
      });

      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
      google.accounts.id.prompt();
    };
    document.body.append(script);
  }, []);

  // const redirect = () => {
  //   history.push(`/preferences`)
  // }

  return (
    <Container className="signInDiv" sx={{ width: "75%" }}>
      <Box
        className="WelcomeBox1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "50%",
          fontSize: "1.5em",
          textAlign: "center",
          padding: "em",
          flexGrow: 1,
          backgroundColor: "#f7a05e",
          borderRadius: "35px",
          margin: 2,
        }}
      >
        <Box
          className="WelcomeBox3"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2em",
            height: "75",
            textAlign: "center",
            padding: "em",
            flexGrow: 1,
            backgroundColor: "#fff",
            borderRadius: "35px",
            margin: "3vh",
            flexDirection: "column",
            backgroundColor: "snow",
          }}
        >
          <Box sx={{ marginTop: 1 }}>Welcome</Box>
          <Box sx={{ flexDirection: "column", borderRadius: "1em", margin: 3 }}>
            <Box sx={{ margin: 1 }}>
              <TextField id="outlined-basic" label="Email" variant="outlined" />
            </Box>
            <Box sx={{ margin: 1 }}>
              <TextField id="outlined-basic" label="Password" variant="outlined" />
            </Box>
            <Box sx={{ margin: 1 }}>
              <Button variant="outlined">Log In</Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        style={{
          display: "flex",
          alignItems: "center",
          textAlign: "center",
          justifyContent: "center",
          padding: "6em",
          fontSize: "1.5em",
        }}
      >
        {`${isLoggedIn === true ? history.push("/preferences") : "Login to access a world of spoontastic recipes!"}`}
      </Box>
    </Container>
  );
};
