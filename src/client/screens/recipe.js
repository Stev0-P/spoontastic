import React from "react";
import { Box } from "@mui/system";
import { Typography, List, ListItem, ListItemText, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import { useHistory } from "react-router-dom";

const macrosList = [
  {
    name: "Calories",
    amount: "438",
  },
  {
    name: "Protein",
    amount: "18g",
  },
  {
    name: "Fat",
    amount: "6g",
  },
  {
    name: "Saturated Fat",
    amount: "2g",
  },
  {
    name: "Carbohydrates",
    amount: "49g",
  },
];

const ingredientsList = [
  {
    name: "1 tbsp butter",
    id: 1,
  },
  {
    name: "2 Lemons",
    id: 2,
  },
  {
    name: "Fish",
    id: 3,
  },
  {
    name: "Seasonings",
    id: 4,
  },
  {
    name: "Oven 30-min",
    id: 5,
  },
];
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: "white",
}));

const Recipe = () => {
  const history = useHistory();
  return (
    <Box sx={{ display: " flex", flexDirection: "column" }}>
      <Box sx={{ marginLeft: 3, marginTop: 4 }}>
        <Typography variant="h3">Lemon Herb Grilled Salmon</Typography>
      </Box>
      <Box sx={{ marginLeft: 3, marginTop: 2, flexDirection: "row" }}>
        <Box>
          <Rating name="read-only" size="large" value={4} readOnly />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <img
            style={{
              height: "350px",
              width: "450px",
              borderRadius: "1em",
            }}
            src="https://images.unsplash.com/photo-1619734490039-a68d5c82cf30?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&q=80"
          ></img>
          <Box>
            <Demo sx={{ borderRadius: "1em" }}>
              <List>
                {macrosList.map((item) => (
                  <ListItem
                    key={item.name}
                    sx={{
                      backgroundColor: "#f5efe9",
                      borderRadius: "1em",
                      marginTop: "0.5em",
                      boxShadow: 2,
                      marginLeft: 3,
                    }}
                    disablePadding
                  >
                    <ListItemText
                      primary={item.name}
                      secondary={item.amount}
                      sx={{
                        margin: 0.5,
                        height: "3em",
                        backgroundColor: "#FAFAF9",
                        borderRadius: "1em",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingLeft: "1em",
                        paddingRight: "1em",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Demo>
          </Box>
          <Box sx={{ marginLeft: "5%" }}>
            <Demo sx={{ borderRadius: "1em" }}>
              <List>
                {ingredientsList.map((item) => (
                  <ListItem
                    key={item.id}
                    sx={{
                      backgroundColor: "#f5efe9",
                      borderRadius: "1em",
                      marginTop: "0.5em",
                      boxShadow: 2,
                      marginLeft: 3,
                    }}
                    disablePadding
                  >
                    <ListItemText
                      primary={item.name}
                      sx={{
                        margin: 0.5,
                        height: "3em",
                        backgroundColor: "#FAFAF9",
                        borderRadius: "1em",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        paddingLeft: "1em",
                        paddingRight: "1em",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Demo>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          backgroundColor: "#f7a05e",
          borderRadius: "1em",
          marginRight: 4,
          marginLeft: 3,
          marginTop: 3,
          paddingTop: "1em",
        }}
      >
        <Typography sx={{ paddingLeft: "0.525em" }} variant="h4">
          Description
        </Typography>
        <Box
          sx={{
            backgroundColor: "#f5efe9",
            borderRadius: "1em",
            paddingTop: "1em",
            paddingLeft: "1.5em",
            paddingBottom: "1.5em",
          }}
        >
          <Typography variant="body1">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
            anim id est laborum.
          </Typography>
        </Box>
      </Box>
      <Chip
        label="Return"
        variant="outlined"
        color="success"
        onClick={() => history.goBack()}
        sx={{
          fontSize: "1.5em",
          fontWeight: "bold",
          height: "2em",
          borderWidth: "1.75px",
          marginLeft: "35%",
          marginRight: "35%",
          marginTop: "2%",
        }}
      />
    </Box>
  );
};

export default Recipe;
