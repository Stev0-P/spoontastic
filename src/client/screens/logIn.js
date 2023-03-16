import React, { useEffect, useState, useContext } from "react";
import { Box, Container, Button, TextField, Typography, Link, CardContent, CssBaseline } from "@mui/material";
import Card from "@mui/material/Card";
import UserContext from "..//context/User";
import { useHistory } from "react-router-dom";
import CardReg from "../components/CardReg";
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
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          backgroundColor: "lightgray",
        }}
      >
        <Card variant="outlined" raised={true} sx={{ boxShadow: 5 }}>
          <CardContent>
            <Container className="signInDiv" sx={{ width: "75%" }}>
              <Box sx={{ marginTop: 0.4, textAlign: "center" }}>
                <Typography variant="h5">Sign In</Typography>
              </Box>
              <Box sx={{ flexDirection: "column", borderRadius: "1em", margin: 3, textAlign: "center" }}>
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

              <Box>{`${isLoggedIn === true ? history.push("/dashboard") : " "}`}</Box>
            </Container>
          </CardContent>
        </Card>
      </Box>
    </React.Fragment>
  );
};
