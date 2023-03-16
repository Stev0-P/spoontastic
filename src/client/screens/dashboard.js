import React, { useEffect, useContext } from "react";
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

  const history = useHistory();
  const location = useLocation();
  const activeUser = useContext(UserContext);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, marginLeft: "13%" }}>
      <Widget />
      <RecipeList label="Recommended" />
    </Box>
  );
};

export default Dashboard;
