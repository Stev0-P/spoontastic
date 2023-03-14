import React, { useEffect, useState, useContext } from "react";
import {
  Box,
  Container,
  Button,
  TextField,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
} from "@mui/material";
import UserContext from "..//context/User";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { response } from "express";

export const Register = () => {
  const history = useHistory();
  const { userId, setUserId } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [diet, setDiet] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const [intolToString, setIntolToString] = useState([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPass, setUserPass] = useState("");

  const handleCallbackResponse = async (response) => {
    const { data: res } = await axios.post("/api/account/", {
      JWT: response.credential,
    });

    setUserId(res.user.id);
    setIsLoggedIn(true);
  };
  const intoleranceList = [
    "Dairy",
    "Egg",
    "Gluten",
    "Grain",
    "Peanut",
    "Seafood",
    "Sesame",
    "Shellfish",
    "Soy",
    "Sulfite",
    "Tree Nut",
    "Wheat",
  ];

  useEffect(() => {
    setIntolerance(intolToString.join(","));
  }, [intolToString]);

  const handleDietChange = (event) => {
    setDiet(event.target.value);
  };

  const handleIntoleranceChange = (event) => {
    const {
      target: { value },
    } = event;
    setIntolToString(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleNameChange = (event) => {
    setUserName(event.target.value);
    console.log(userName);
  };

  const handleEmailChange = (event) => {
    setUserEmail(event.target.value);
    console.log(userEmail);
  };
  const handlePasswordChange = (event) => {
    setUserPass(event.target.value);
    console.log(userPass);
  };
  const userExists = (response) => {
    if (response === true) {
      history.push("/login");
    } else {
      console.log("User Exists");
    }
  };

  const handleSubmit = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.post("/api/account/register/", {
          diet: diet,
          intolerances: intolerance,
          fullName: userName,
          email: userEmail,
          password: userPass,
        });
        userExists(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };

  return (
    <Container className="signInDiv" sx={{ width: "75%", height: "100%" }}>
      <Box
        className="WelcomeBox1"
        style={{
          display: "flex",
          height: "50%",
          fontSize: "1.5em",
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
            marginTop: "2em",
            flexDirection: "column",
            backgroundColor: "snow",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", borderRadius: "1em" }}>
            <Box sx={{ margin: 1 }}>
              <TextField
                id="outlined-basic"
                label="Full Name"
                variant="outlined"
                value={userName}
                onChange={handleNameChange}
              />
            </Box>
            <Box>
              <FormControl sx={{ width: "93%" }}>
                <InputLabel htmlFor="your-diet">Your Diet</InputLabel>
                <Select
                  autoFocus
                  value={diet}
                  onChange={handleDietChange}
                  label="Your Diet"
                  inputProps={{
                    name: "your-diet",
                    id: "your-diet",
                  }}
                >
                  <MenuItem value="regular">Regular</MenuItem>
                  <MenuItem value="gluten free">Gluten Free</MenuItem>
                  <MenuItem value="ketogenic">Ketogenic</MenuItem>
                  <MenuItem value="vegetarian">Vegetarian</MenuItem>
                  <MenuItem value="lacto-vegetarian">Lacto-Vegetarian</MenuItem>
                  <MenuItem value="ovo-vegetarian">Ovo-Vegetarian</MenuItem>
                  <MenuItem value="vegan">Vegan</MenuItem>
                  <MenuItem value="pescaterian">Pescaterian</MenuItem>
                  <MenuItem value="paleo">Paleo</MenuItem>
                  <MenuItem value="primal">Primal</MenuItem>
                  <MenuItem value="whole30">Whole 30</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl sx={{ width: "93%", marginTop: 1 }}>
                <InputLabel htmlFor="your-intolerance">Your Intolerance</InputLabel>
                <Select
                  autoFocus
                  value={intolToString}
                  multiple
                  onChange={handleIntoleranceChange}
                  label="your-Intolerance"
                  inputProps={{
                    name: "your-intolerance",
                    id: "your-intolerance",
                  }}
                  input={<OutlinedInput label="Your Intolerance" />}
                >
                  {intoleranceList.map((intolerance) => (
                    <MenuItem key={intolerance} value={intolerance}>
                      {intolerance}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ margin: 1 }}>
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                value={userEmail}
                onChange={handleEmailChange}
              />
            </Box>
            <Box>
              <TextField
                id="outlined-basic"
                label="Password"
                variant="outlined"
                value={userPass}
                onChange={handlePasswordChange}
              />
            </Box>
            <Box sx={{ margin: 1 }}>
              <Button variant="outlined" onClick={() => handleSubmit()}>
                Register
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
