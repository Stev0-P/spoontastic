import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useHistory, useLocation } from "react-router-dom";

const DashboardWidgets = () => {
  const tempROTD = {
    description: "Lemon Herb Grilled Salmon",
    img: "https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80",
    route: "/recipe:id",
  };

  const RecipeOfTheDay = () => {
    const history = useHistory();

    return (
      <Container
        sx={{
          borderRadius: "2em",
          width: "200px",
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          backgroundColor: "#f7a05e",
          marginRight: 4,
          marginLeft: 3,
          marginTop: 3,
          paddingTop: "1em",
          boxShadow: 3,
        }}
        onClick={() => history.push("/recipe/:id")}
      >
        <Typography sx={{ display: "flex" }} variant="h6" component="div">
          Recipe Of The Day
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "column",
            backgroundColor: "#f7a05e",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#f5efe9",
              borderRadius: "1em",
              borderTop: "1em",
              width: "200px",
            }}
          >
            <Typography variant="body1">
              <Box>
                <img
                  style={{
                    height: "125px",
                    width: "150px",
                    borderRadius: "1em",
                  }}
                  src={tempROTD.img}
                />
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "centre",
                    mt: 4,
                    mb: 2,
                    backgroundColor: "#f5efe9",
                    marginTop: 1,
                    boxShadow: 2,
                    borderRadius: "1em",
                    paddingTop: "1em",
                    paddingLeft: "1em",
                    paddingBottom: "1.5em",
                  }}
                  variant="h7"
                  component="div"
                >
                  {tempROTD.description}
                </Typography>
              </Box>
            </Typography>
          </Box>
        </Box>
        ;
      </Container>
    );
  };

  return <div>{RecipeOfTheDay()}</div>;
};

export default DashboardWidgets;
