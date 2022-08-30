import React, { useEffect, useState, useContext } from "react";
import { Box, Container } from "@mui/material";
import UserContext from "..//context/User";

export const LogIn = () => {
  const [auth, setAuth] = useState(false);
  const [userId, setUserId] = useContext(UserContext); 

  const handleCallbackResponse = async (response) => {
    const res = await fetch('http://localhost:3000/api/account/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        JWT: response.credential
      })
    })
    console.log("Encoded JWT ID Token: " + response.credential);
    console.log(response.clientId);
    const responseData = await res.json();
    console.log(responseData.user.id);
    setUserId(responseData.user.id);
    setAuth(true)
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
    console.log(userId)
  }, []);

  return (
    <Container className="signInDiv">
      <Box
        className="WelcomeBox1"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "30vh",
          fontSize: "1.5em",
          textAlign: "center",
          padding: "em",
          flexGrow: 1,
          backgroundColor: "#f7a05e",
          borderRadius: "1em",
          margin: 2,
        }}
      >
        <Box
          className="WelcomeBox2"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "25vh",
            padding: "em",
            flexGrow: 1,
            backgroundColor: "#81c784",
            borderRadius: "1em",
            margin: "3vh",
          }}
        >
          <Box
            className="WelcomeBox3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2em",
              height: "20vh",
              textAlign: "center",
              padding: "em",
              flexGrow: 1,
              backgroundColor: "#fff",
              borderRadius: "1em",
              margin: "3vh",
            }}
          >
            Welcome to Spoontastic
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
        Login with Google to access a world of spoontastic recipes!
      </Box>
    </Container>
  );
};
