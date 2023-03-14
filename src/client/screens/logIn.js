import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Button, TextField, Typography, Link } from "@mui/material";
import UserContext from "..//context/User";
import { useHistory } from "react-router-dom";
import axios from "axios";

export const LogIn = () => {
  const history = useHistory();
  const { userId, setUserId } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleCallbackResponse = async (response) => {
    console.log(response);
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

  const userLogIn = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/account/", {
          email: userEmail,
          password: userPassword,
        });
        setUserId(response.user.id);
        setIsLoggedIn(true);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  const handleEmail = (event) => {
    setUserEmail(event.target.value);
  };

  const handlePassword = (event) => {
    setUserPassword(event.target.value);
  };

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
          margin: 15,
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
          <Box sx={{ marginTop: 0.4 }}>Welcome</Box>
          <Box sx={{ flexDirection: "column", borderRadius: "1em", margin: 3 }}>
            <Box sx={{ margin: 1 }}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={userEmail}
                onChange={handleEmail}
              />
            </Box>
            <Box sx={{ margin: 1 }}>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                value={userPassword}
                onChange={handlePassword}
              />
            </Box>
            <Box sx={{ margin: 1 }}>
              <Button variant="outlined" onClick={() => userLogIn()}>
                Log In
              </Button>
            </Box>
            <Box>
              <Typography>If you do not have an account</Typography>
              <Link href="/register" variant="body1">
                Register
              </Link>
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
        {`${isLoggedIn === true ? history.push("/dashboard") : " "}`}
      </Box>
    </Container>
  );
};
