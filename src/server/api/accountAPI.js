import { v4 as uuid4 } from "uuid";
import { Router } from "express";
import userSchema from "../services/users/user.model";
import jwt_decode from "jwt-decode";
import { UserRefreshClient } from "googleapis-common";

const accountAPI = Router();

// const DUMMY_USERS = [
//   {
//     id: "1",
//     name: "Oran Doherty",
//     email: "oran.doherty@wearenova.co.uk",
//   },
// ];

accountAPI.get("/getUsers", async (req, res, next) => {
  let users;
  try {
   users = await userSchema.find();
  } catch (err) {
    const error = new Error("Fetching users failed, please try again later.");
    error.code = 500;
    return next(error);
  }
  res.json({users: users.map(user => user.toObject({ getters: true }))})
});

accountAPI.post("/createUser", async (req, res, next) => {
  const { JWT } = req.body;
  var decoded = jwt_decode(JWT);
  console.log(decoded);
  
  let existingUser;
  try {
    existingUser = await userSchema.findOne({ email: decoded.email })
  } catch (err) {
    const error = new Error("Signing up failed, please try again later.");
    error.code = 500;
    return next(error);
  }

  const createdUser = new userSchema({
    name: decoded.name,
    email: decoded.email,
    preferences: [],
    favourites: [],
    picture: decoded.picture
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new Error("Creating user failed, please try again");
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ user: createdUser });
});

accountAPI.post("/login", async (req, res, next) => {
  const { JWT } = req.body;
  var decoded = jwt_decode(JWT);

  let existingUser
  try {
    existingUser = await userSchema.findOne({ email: decoded.email })
  } catch (err) {
    const error = new Error("Loging in failed, please try again later");
    error.code = 500;
    return next(error);
  }
  
  if (!existingUser || decoded.email_verified !== true) {
    const error = new Error("Could not identify user, credentials seem to be wrong.");
    error.code = 401;
    return next(error);
  }

  res.json({ message: "Logged in!" })
});

export default accountAPI;
