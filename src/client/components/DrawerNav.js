import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  TextField,
} from "@mui/material";
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

import axios from "axios";

const drawerWidth = "13%";

const intoleranceList = [
  "Dairy",
  "Egg",
  "Gluten",
  "Grain",
  "Peanut",
  "Seafood",
  "Sesame",
  "Shellfish",
  "Soy",
  "Sulfite",
  "Tree Nut",
  "Wheat",
];

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
  const [logout, setLogout] = useState(false);
  const [diet, setDiet] = useState(activeUser.diet);
  const [open, setOpen] = React.useState(false);
  const [intolerance, setIntolerance] = useState("");
  const [intolToString, setIntolToString] = useState([activeUser.intolerance]);

  useEffect(() => {
    setLoggedInUser(activeUser);
    let stringIntol = activeUser.intolerance.toString();
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

  const handleDietChange = (event) => {
    setDiet(
      // @ts-expect-error autofill of arbitrary value is not handled.
      event.target.value
    );
  };

  const handleIntoleranceChange = (event) => {
    const {
      target: { value },
    } = event;
    setIntolToString(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );

    let stringIntol = intolToString.toString();
    setIntolerance(stringIntol);
  };

  const handleSubmit = async () => {
    const { data: response } = await axios.patch("/api/preferences/change", {
      diet: diet === "" ? activeUser.diet : diet,
      intolerance: intolerance === "" ? activeUser.intolerance : intolerance,
      email: activeUser.email,
    });

    handleClose();
    window.location.reload();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userLogout = () => {
    const fetchApi = async () => {
      try {
        const { data: response } = await axios.delete("/api/account/logout");
        navLogin(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
  };
  const navLogin = (response) => {
    if (response === true) {
      history.push("/login");
    } else {
    }
  };
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
        variant={
          location.pathname === "/" ||
          location.pathname === "/login" ||
          location.pathname === "/preferences" ||
          location.pathname === "/register"
            ? "persistent"
            : "permanent"
        }
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
                    width: "3.4em",
                    height: "3.4em",
                    bgcolor: "#f7a05e",
                    color: "black",
                  }}
                >
                  <img
                    style={{ height: "3.025em", width: "3.025em", borderRadius: "50%" }}
                    src={`${loggedInUser.picture}`}
                  ></img>
                </Avatar>
                <ListItem>
                  <Button
                    variant="outlined"
                    color="neutral"
                    onClick={handleClickOpen}
                    sx={location.pathname === "/account" ? { backgroundColor: "#81c784" } : null}
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
                    className={location.pathname === item.route ? classes.active : null}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          <Button variant="outlined" color="error" sx={{ margin: 1 }} onClick={userLogout}>
            Log Out
          </Button>
        </Box>
      </Drawer>
      <Box>
        <Dialog fullWidth={false} maxWidth="sm" open={open} onClose={handleClose}>
          <DialogTitle>Account</DialogTitle>
          <DialogContent>
            <DialogContentText>You can view your details and change dietary preferences here.</DialogContentText>
            <Box
              noValidate
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box sx={{ padding: "1vh" }}>
                <TextField
                  id="outlined-read-only-input"
                  label="Name"
                  defaultValue={activeUser.name}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ padding: "1vh" }}>
                <TextField
                  id="outlined-read-only-input"
                  label="E-Mail"
                  defaultValue={activeUser.email}
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ width: "100%" }}
                />
              </Box>
              <Box sx={{ padding: "1vh" }}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel htmlFor="your-diet">Your Diet</InputLabel>
                  <Select
                    autoFocus
                    value={diet}
                    onChange={handleDietChange}
                    label="Your Diet"
                    inputProps={{
                      name: "your-diet",
                      id: "your-diet",
                    }}
                  >
                    <MenuItem value="regular">Regular</MenuItem>
                    <MenuItem value="gluten free">Gluten Free</MenuItem>
                    <MenuItem value="ketogenic">Ketogenic</MenuItem>
                    <MenuItem value="vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="lacto-vegetarian">Lacto-Vegetarian</MenuItem>
                    <MenuItem value="ovo-vegetarian">Ovo-Vegetarian</MenuItem>
                    <MenuItem value="vegan">Vegan</MenuItem>
                    <MenuItem value="pescaterian">Pescaterian</MenuItem>
                    <MenuItem value="paleo">Paleo</MenuItem>
                    <MenuItem value="primal">Primal</MenuItem>
                    <MenuItem value="whole30">Whole 30</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ padding: "1vh" }}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel htmlFor="your-intolerance">Your Intolerance</InputLabel>
                  <Select
                    autoFocus
                    value={intolToString}
                    multiple
                    onChange={handleIntoleranceChange}
                    label="Your-Intolerance"
                    inputProps={{
                      name: "your-intolerance",
                      id: "your-intolerance",
                    }}
                    input={<OutlinedInput label="Your Intolerance" />}
                  >
                    {intoleranceList.map((intolerance) => (
                      <MenuItem key={intolerance} value={intolerance}>
                        {intolerance}
                      </MenuItem>
                    ))}
                    {/* <MenuItem value="egg">Egg</MenuItem>
                        <MenuItem value="gluten">Gluten</MenuItem>
                        <MenuItem value="grain">Grain</MenuItem>
                        <MenuItem value="peanut">Peanut</MenuItem>
                        <MenuItem value="seafood">Seafood</MenuItem>
                        <MenuItem value="sesame">Sesame</MenuItem>
                        <MenuItem value="shellfish">Shellfish</MenuItem>
                        <MenuItem value="soy">Soy</MenuItem>
                        <MenuItem value="sulfite">Sulfite</MenuItem>
                        <MenuItem value="tree-nut">Tree-Nut</MenuItem>
                        <MenuItem value="">Wheat</MenuItem> */}
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", padding: "2vh" }}>
                <Button variant="outlined">Submit</Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </Box>
  );
};

export default DrawerNav;
