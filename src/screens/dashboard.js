import React from "react";
import RecipeList from "../components/RecipeList";
import Container from "@mui/material/Container";
import DashboardWidgets from "../components/DashboardWidgets";
import { Box } from "@mui/system";
import Widget from "../components/Widget";

const Dashboard = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
      <Widget />
      <RecipeList label="Reccomended" />
    </Box>
  );
};

export default Dashboard;
