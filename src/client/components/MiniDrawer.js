import React, { useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useHistory, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  OutlinedInput,
  Button,
} from "@mui/material";
import UserContext from "..//context/User";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer() {
  const history = useHistory();
  const theme = useTheme();
  const [diet, setDiet] = useState("");
  const [open, setOpen] = React.useState(false);
  const [intolerance, setIntolerance] = useState("");
  const [intolToString, setIntolToString] = useState([]);
  const activeUser = useContext(UserContext);

  useEffect(() => {
    setIntolerance(intolToString.join(","));
  }, [intolToString]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
      console.log("unable to logout");
    }
  };

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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <Drawer variant="permanent">
        <IconButton>
          <AccountCircleIcon onClick={handleClickOpen} fontSize="large" />
        </IconButton>

        <Divider />
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <List>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => history.push("/dashboard")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <GridViewRoundedIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => history.push("/search")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <SearchRoundedIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => history.push("/favourites")}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <StarRateRoundedIcon fontSize="medium" />
                </ListItemIcon>
                <ListItemText sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </List>
          <Divider />
        </Box>
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
                      defaultValue={activeUser.diet}
                      onChange={handleDietChange}
                      label="Your Diet"
                      inputProps={{
                        name: "your-diet",
                        id: "uncontrolled-native",
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
                      multiple
                      value={intolToString === [] ? activeUser.intolerance : intolToString}
                      onChange={handleIntoleranceChange}
                      label="Your-Intolerance"
                      inputProps={{
                        name: "your-intolerance",
                      }}
                      input={<OutlinedInput label="Your Intolerance" />}
                    >
                      {intoleranceList.map((intolerance) => (
                        <MenuItem key={intolerance} value={intolerance}>
                          {intolerance}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <DialogActions>
                  <Button variant="outlined" onClick={handleSubmit}>
                    Submit
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Dialog>
        </Box>

        <IconButton>
          <LogoutRoundedIcon onClick={userLogout} color="error" />
        </IconButton>
      </Drawer>
    </Box>
  );
}
