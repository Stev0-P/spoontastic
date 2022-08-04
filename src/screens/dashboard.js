import React from "react";
import RecipeList from "../components/RecipeList";
import Container from "@mui/material/Container";
import DashboardWidgets from "../components/DashboardWidgets";

const Dashboard = () => {
  return (
    <Container>
      <DashboardWidgets />
      <RecipeList label="Reccomended" />
    </Container>
  );
};

export default Dashboard;
