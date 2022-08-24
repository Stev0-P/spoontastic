import React from "react";
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

//Hard Coded user, needs to be fetched from database
const user = {
  name: "Steven Pahyrya",
  diet: "primal",
  intolerances: "dairy",
  userID: "",
};

const App = () => (
  <Box sx={{ display: "flex" }}>
    <UserContext.Provider value={user}>
      <DrawerNav />

      <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route exact={true} path="/login" component={LogIn} />
        <Route exact={true} path="/preferences" component={Preferences} />
        <Route exact={true} path="/dashboard" component={Dashboard} />
        <Route exact={true} path="/search" component={Search} />
        <Route exact={true} path="/favourites" component={Favourites} />
        <Route exact={true} path="/recipe/:id" component={Recipe} />
        <Route exact={true} path="/account" component={Account} />
      </Switch>
    </UserContext.Provider>
  </Box>
);

export default App;
