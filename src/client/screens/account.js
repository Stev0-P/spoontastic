import React, { useContext } from "react";
import { Box, Container } from "@mui/system";
import { Chip, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import UserContext from "..//context/User";
import axios from "axios";

const Account = () => {
  const activeUser = useContext(UserContext);

  const handleClickLogOut = () => {
    console.info("You clicked the Chip.");
  };
  const handleClickPreferences = () => {
    console.info("You clicked the Chip.");
  };
  const history = useHistory();

  const userLogout = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete("/api/account/logout");
        navLogin(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };
  const navLogin = (response) => {
    if (response === true) {
      history.push("/login");
      console.log("navigate to login");
    } else {
      console.log("unable to logout");
    }
  };
  return (
    <Box sx={{ display: "flex", flexDirection: "column", marginLeft: 2, flexGrow: 1 }}>
      <Typography variant="h1" component="div">
        {" "}
        Account
      </Typography>
      <Box>
        <Box sx={{ marginTop: 3, marginBottom: 3 }}>
          <Chip
            label="Name:"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
          />
          <Chip
            label={activeUser.name}
            variant="outlined"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
          />
        </Box>
        <Box display="flex" sx={{ flexDirection: "row" }}>
          <Chip
            label="E-Mail:"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
          />
          <Chip
            label={activeUser.email}
            variant="outlined"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
          />
          <Box sx={{ flexDirection: "row-reverse" }}>
            <Chip
              label="Log Out"
              variant="outlined"
              color="error"
              onClick={userLogout}
              sx={{ fontSize: "1.5em", fontWeight: "bold", height: "2em", borderWidth: "1.75px", marginLeft: 4 }}
            />
          </Box>
        </Box>

        <Box sx={{ marginTop: 3, marginRight: 5, marginBottom: 1 }}>
          <Divider />
          <Divider sx={{ marginTop: 1 }} />
        </Box>
        <Box sx={{ marginTop: 3, marginBottom: 3 }}>
          <Chip
            label="Diet:"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
          />
          <Chip
            label={activeUser.diet}
            variant="outlined"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
          />
        </Box>
        <Box display="flex" sx={{ flexDirection: "row" }}>
          <Chip
            label="Intolerances:"
            size="medium"
            sx={{ fontSize: "1.5em", height: "2em", boxShadow: 1, backgroundColor: "#f7a05e" }}
          />
          <Box>
            <Chip
              label={activeUser.intolerance}
              variant="outlined"
              size="medium"
              sx={{ fontSize: "1.5em", height: "2em", marginLeft: 2, boxShadow: 2 }}
            />

            <Chip
              label="Change Preferences"
              variant="outlined"
              color="error"
              onClick={handleClickPreferences}
              sx={{ fontSize: "1.5em", fontWeight: "bold", height: "2em", borderWidth: "1.75px", marginLeft: 4 }}
            />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", marginTop: 10, marginRight: "15%", marginLeft: "15%" }}>
        <Chip
          label="Return"
          variant="outlined"
          color="success"
          onClick={() => history.goBack()}
          sx={{ fontSize: "1.5em", fontWeight: "bold", height: "2em", borderWidth: "1.75px" }}
        />
      </Box>
    </Box>
  );
};

export default Account;
