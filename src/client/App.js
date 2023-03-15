import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home";
import "./App.css";
import Account from "./screens/account";
import Dashboard from "./screens/dashboard";
import { LogIn } from "./screens/logIn";
import Favourites from "./screens/favourites";
import Recipe from "./screens/recipe";
import Search from "./screens/search";
import Preferences from "./screens/preferences";
import DrawerNav from "./components/DrawerNav";
import { Box } from "@mui/system";
import UserContext from "./context/User";
import axios from "axios";
import Register from "./screens/register";
import CssBaseline from "@mui/material/CssBaseline";
import darkScrollbar from "@mui/material/darkScrollbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container } from "@mui/material";

const App = ({ user }) => {
  const [userId, setUserId] = useState(user?.userID ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [picture, setPicture] = useState(user?.picture ?? "");
  const [diet, setDiet] = useState(user?.diet ?? "");
  const [intolerance, setIntolerance] = useState(user?.intolerances ?? "");
  const [type, setType] = useState(user?.type ?? "");

  const activeUser = {
    name,
    email,
    picture,
    diet,
    intolerance,
    type,
    userId,
    setUserId,
  };

  return (
    <React.Fragment>
      <CssBaseline>
        <Container
          disableGutters
          maxWidth="false"
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            height: "100%",
          }}
        >
          <UserContext.Provider value={activeUser}>
            <DrawerNav />
            <Switch>
              <Route exact={true} path="/" component={LogIn} />
              <Route exact={true} path="/login" component={LogIn} />
              <Route exact={true} path="/preferences" component={Preferences} />
              <Route exact={true} path="/dashboard" component={Dashboard} />
              <Route exact={true} path="/search" component={Search} />
              <Route exact={true} path="/favourites" component={Favourites} />
              <Route exact={true} path="/recipe/:id" component={Recipe} />
              <Route exact={true} path="/account" component={Account} />
              <Route exact={true} path="/register" component={Register} />
            </Switch>
          </UserContext.Provider>
        </Container>
      </CssBaseline>
    </React.Fragment>
  );
};

export default App;
