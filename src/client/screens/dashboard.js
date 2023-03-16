import React, { useEffect, useContext } from "react";
import { Typography } from "@mui/material";
import RecipeList from "../components/RecipeList";
import Container from "@mui/material/Container";
import DashboardWidgets from "../client/components/DashboardWidgets";
import { Box } from "@mui/system";
import Widget from "../components/Widget";
import { useHistory, useLocation } from "react-router-dom";
import UserContext from "../context/User";

const Dashboard = () => {
  useEffect(() => {
    if (activeUser.name === "") {
      history.push("/");
    }
  }, []);
  //<RecipeList label="Recommended" />
  const history = useHistory();
  const location = useLocation();
  const activeUser = useContext(UserContext);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, marginLeft: "13%" }}>
      <Box sx={{ marginLeft: "1.5%", marginTop: "1.5%" }}>
        <Typography variant="h4">We Recommend:</Typography>
      </Box>
      <Widget />
      <RecipeList />
    </Box>
  );
};

export default Dashboard;
