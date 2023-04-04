import { v4 as uuid4 } from "uuid";
import { Router } from "express";
import userSchema from "../services/users/user.model";
import jwt_decode from "jwt-decode";
import { UserRefreshClient } from "googleapis-common";
import { CoPresent } from "@mui/icons-material";

const accountAPI = Router();

accountAPI.get("/getUser/:uid", async (req, res, next) => {
  const userID = req.params.uid;
  let user;

  try {
    user = await userSchema.findById({ _id: userID });
  } catch (err) {
    console.log(err);
    const error = new Error("Fetching users failed, please try again later.");
    error.code = 500;
    return next(error);
  }
  const objectId = req.session.user;
  const myObjectIdString = objectId.toString();
  res.json({ user: user.toObject({ getters: true }) });
});

accountAPI.post("/", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //console.log(decoded);
    /*
    if (!decoded.email_verified) {
      const error = new Error("Could not identify user, credentials seem to be wrong.");
      error.code = 401;
      return next(error);
    }
*/
    let user = await userSchema.findOne({ email: email });

    if (!user) {
      res.status(401).send(false);
    }
    if (password !== user.password) {
      res.status(400).send(false);
    }
    console.log(user._id);
    //console.log("Logged in!");
    req.session.isAuth = true;
    req.session.user = user._id;
    //console.log(req.session.user);
    res.status(201).json({ user });
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
    error.code = 500;
    return next(error);
  }
});

accountAPI.post("/register", async (req, res, next) => {
  try {
    const { diet, intolerances, fullName, email, password } = req.body;

    let user = await userSchema.findOne({ email: email });

    if (!user) {
      const createdUser = new userSchema({
        name: fullName,
        email: email,
        favourites: [],
        diet: diet,
        intolerances: intolerances,
        password: password,
      });
      await createdUser.save();
      res.status(200).send(true);
    } else {
      res.status(500).send(false);
    }
  } catch (err) {
    const error = new Error("Registration up failed, please try again later.");
    error.code = 500;
    return next(error);
  }
});

accountAPI.delete("/logout", (req, res) => {
  if (req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).send(false);
        console.log("cant log out");
      } else {
        res.send(true);
      }
    });
  } else {
    res.end();
    console.log("end");
  }
});

export default accountAPI;
