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
  console.log("ObjectUserID: " + myObjectIdString);
  console.log("UserID ffrom client:" + userID);
  res.json({ user: user.toObject({ getters: true }) });
});

accountAPI.post("/", async (req, res, next) => {
  try {
    const { JWT } = req.body;
    var decoded = jwt_decode(JWT);
    //console.log(decoded);

    if (!decoded.email_verified) {
      const error = new Error("Could not identify user, credentials seem to be wrong.");
      error.code = 401;
      return next(error);
    }

    let user = await userSchema.findOne({ email: decoded.email });

    if (!user) {
      const createdUser = new userSchema({
        name: decoded.name,
        email: decoded.email,
        preferences: [],
        favourites: [],
        picture: decoded.picture,
        JWT,
      });

      await createdUser.save();
      user = createdUser;
    }

    //console.log("Logged in!");
    req.session.isAuth = true;
    req.session.user = user._id;
    res.status(201).json({ user });
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
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
        console.log("logged out");
      }
    });
  } else {
    res.end();
    console.log("end");
  }
});

// accountAPI.post("/login", async (req, res, next) => {
//   // pull jwt req.body from login
//   const { JWT } = req.body;
//   var decoded = jwt_decode(JWT);

//   let existingUser;
//   try {
//     existingUser = await userSchema.findOne({ email: decoded.email });
//   } catch (err) {
//     const error = new Error("Loging in failed, please try again later");
//     error.code = 500;
//     return next(error);
//   }

//   if (!existingUser || decoded.email_verified !== true) {
//     const error = new Error("Could not identify user, credentials seem to be wrong.");
//     error.code = 401;
//     return next(error);
//   }

//   res.json({ message: "Logged in!" });
// });

export default accountAPI;
