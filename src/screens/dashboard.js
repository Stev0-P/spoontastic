import React from "react";
import RecipeList from "../components/RecipeList";
import Container from "@mui/material/Container";
import DashboardWidgets from "../components/DashboardWidgets";
import { Box } from "@mui/system";

const Dashboard = () => {
  return (
    <Box>
      <RecipeList label="Reccomended" />
   </Box>
  );
};

export default Dashboard;
