import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const DashboardWidgets = () => {
  const tempROTD = {
    description: "Pizza",
    img: "https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80",
    route: "/recipe:id",
  };

  const RecipeOfTheDay = () => {
    return (
      <Container
        sx={{
          flexGrow: 1,
          backgroundColor: "#f7a05e",
          borderRadius: "2em",
          width: "200px"
        }}
      >
        <Typography
          sx={{display: "flex", justifyContent: "centre", mt: 4, mb: 2}}
          variant="h6"
          component="div"
        >
          Recipe Of The Day
        </Typography>
        <div>
          <img
            style={{
              height: "125px",
              width: "150px",
              borderRadius: "1em",
            }}
            src={tempROTD.img}
          />
          <Typography
            sx={{display: "flex", justifyContent: "centre", mt: 4, mb: 2, marginLeft: 1, marginTop: 1, backgroundColor: '#f5efe9', borderRadius: "1em", marginTop: 1, boxShadow: 2}}
            variant="h7"
            component="div"
          >
            {tempROTD.description}
          </Typography>
        </div>
        ;
      </Container>
    );
  };

  return <div>{RecipeOfTheDay()}</div>;
};

export default DashboardWidgets;
