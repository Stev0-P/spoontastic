import React, { useContext, useEffect, useState } from "react";
import { Avatar, Box, Button, ListItemAvatar } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { deepOrange } from "@mui/material/colors";
import { useHistory, useLocation } from "react-router-dom";
import { makeStyles } from "@material-ui/styles";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import UserContext from "..//context/User";

const drawerWidth = 125;

const useStyles = makeStyles({
  active: {
    background: "#81c784",
  },
});

const theme = createTheme({
  palette: {
    neutral: {
      main: "#404040",
      contrastText: "#fff",
    },
  },
});

const DrawerNav = () => {
  const history = useHistory();
  const location = useLocation();
  const classes = useStyles();
  const activeUser = useContext(UserContext);
  const [loggedInUser, setLoggedInUser] = useState({});

  useEffect(() => {
    setLoggedInUser(activeUser);
  }, [activeUser.userId]);

  const itemsList = [
    {
      text: "Dashboard",
      route: "/dashboard",
    },
    {
      text: "Search",
      route: "/search",
    },
    {
      text: "Favourites",
      route: "/favourites",
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <Box>
            <List>
              <ThemeProvider theme={theme}>
                <Avatar
                  sx={{
                    margin: "auto",
                    width: 55,
                    height: 55,
                    bgcolor: "#f7a05e",
                    color: "black",
                  }}
                >
                  <img src={`${loggedInUser.picture}`}></img>
                </Avatar>
                <ListItem>
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={() => history.push("/account")}
                    sx={
                      location.pathname === "/account"
                        ? { backgroundColor: "#81c784" }
                        : null
                    }
                  >
                    Account
                  </Button>
                </ListItem>
              </ThemeProvider>
            </List>
            <Divider />
            <List>
              {itemsList.map((item, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => history.push(item.route)}
                    className={
                      location.pathname === item.route ? classes.active : null
                    }
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Button variant="outlined" color="error" sx={{ margin: 1 }}>
            Log Out
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default DrawerNav;
