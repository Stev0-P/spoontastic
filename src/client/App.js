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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [picture, setPicture] = useState("");
  const [diet, setDiet] = useState("");
  const [intolerance, setIntolerance] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      if (userId !== "default") {
        try {
          const userResponse = await axios.get(`/api/account/getUser/${userId}`);
          console.log(userResponse.data.user.name);
          setName(userResponse.data.user.name);
          setEmail(userResponse.data.user.email);
          setPicture(userResponse.data.user.picture);
          setDiet(userResponse.data.user.diet);
          setIntolerance(userResponse.data.user.intolerance);
          setType(userResponse.data.user.type);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchApi();
  }, [userId]);

  useEffect(() => {
    const fetchApiTWo = async () => {
      if (userId !== "default") {
        try {
          const prefResponse = await axios.get(`/api/preferences/${userId}`);
          console.log(prefResponse.data.diet);
          setDiet(prefResponse.data.diet);
          setIntolerance(prefResponse.data.intolerances);
          setType(prefResponse.data.type);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchApiTWo();
  }, [userId]);

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
    <Box sx={{ display: "flex" }}>
      <UserContext.Provider value={activeUser}>
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
};

export default App;
