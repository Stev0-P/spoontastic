import React from "react";
import RecipeList from "../components/RecipeList";
import Container from "@mui/material/Container";
import DashboardWidgets from "../client/components/DashboardWidgets";
import { Box } from "@mui/system";
import Widget from "../components/Widget";

const Dashboard = () => {
  return (
    <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1}}>
      <Widget />
      <RecipeList label="Recomended" />
    </Box>
  );
};

export default Dashboard;
