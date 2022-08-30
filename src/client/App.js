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

// const [userInfo, setUserInfo] = useState();

// useEffect(() => {
//   const fetchApi = async () => {
//     try {
//       const userResponse = await axios.get(`/api/account/getUser/${userId}`);
//       setUserInfo(userResponse);
//     } catch (err) {
//       console.log(err);
//     }
//   };
//   fetchApi();
//   console.log(userInfo);
// }, []);

const App = () => {
  const [userId, setUserId] = useState("default");

  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const userResponse = await axios.get(`/api/account/getUser/${userId}`);
        setUserInfo(userResponse);
      } catch (err) {
        console.log(err);
      }
    };
    fetchApi();
    console.log(userInfo);
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <UserContext.Provider value={[userId, setUserId]}>
        <UserContext.Provider value={[userInfo, setUserInfo]}>
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
      </UserContext.Provider>
    </Box>
  );
};

export default App;
