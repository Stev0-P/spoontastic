import { Router } from "express";
import { v4 as uuid4 } from "uuid";
import mongoose from "mongoose";
import userRatingsSchema from "../services/reccomender/reccomender.model";
import userSchema from "../services/users/user.model";
import { PlaceSharp } from "@mui/icons-material";
import { spawn } from "child_process";
import recommendedSchema from "../services/reccomender/recs.model";
import recipeSchema from "../services/recipes/recipes.model";
import { ObjectId } from "mongodb";
import axios from "axios";
import { ids } from "googleapis/build/src/apis/ids";

const ratingsAPI = Router();

//get Individual Rating
ratingsAPI.get("/:uid/:rid", async (req, res, next) => {
  const userID = req.params.uid;
  const recipeID = req.params.rid;

  let ratings;

  try {
    ratings = await userRatingsSchema.find({ creator: userID, recipeID: recipeID });
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    console.log(err);
    return next(error);
  }
  res.json({ rating: ratings.map((rating) => rating.toObject({ getters: true })) });
});

//Post Rating to Database
ratingsAPI.post("/", async (req, res, next) => {
  const { rating, creator, recipeID } = req.body;

  const addedRating = new userRatingsSchema({
    creator,
    rating,
    recipeID,
  });

  let user;
  let rat;

  try {
    user = await userSchema.findById(creator);
    rat = await userRatingsSchema.findOne({ recipeID: recipeID, creator: creator });
  } catch (err) {
    const error = new Error("Adding to Favourites failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  if (!user) {
    //check if user exists with this id
    const error = new Error("Could not find user for provided id.");
    error.code = 404;
    return next(error);
  }

  try {
    if (rat === null) {
      //check if rating doesnt exist and save
      await addedRating.save();
      user.ratings.push(addedRating);
      await user.save();
    } else if (rat !== null) {
      //else if rating does exist update it
      rat.rating = rating;
      try {
        await rat.save();
      } catch (err) {
        const error = new Error("Something went wrong, could not update place");
        error.code = 500;
        return next(error);
      }
    }
  } catch (err) {
    //otherwise error
    const error = new Error("Adding Ratings failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ rating: addedRating });
});

//Get Reccomended Recipes
ratingsAPI.get("/recs/", async (req, res, next) => {
  var dir = `${process.cwd()}\\src\\scripts\\ `;

  const { spawn } = require("child_process"); //cread a child process to run a python script
  const pyProg = spawn("python", ["recommender.py"], {
    cwd: dir,
  });

  pyProg.stdout.on("data", function (data) {
    res.end("end");
  });
  let recs;
  let recipes;
  const objectId = req.session.user ?? "";

  try {
    recs = await recommendedSchema.findOne({ creator: objectId }); //find reccomended recipes of the user from current session
  } catch (err) {
    const error = new Error("Finding Reccomended failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  if (recs) {
    //if reccomended exist find recipes with same recipeID and send data to front end
    try {
      recipes = await recipeSchema.find({ recipeID: { $in: recs.recs } });
    } catch (err) {
      const error = new Error("Finding Recipes failed!");
      console.log(err);
      error.code = 500;
      return next(error);
    }
  } else {
    console.log("no recs");
  }

  res.status(201).json({ recommended: recipes });
  // console.log({ reccomended: recipes });
});

export default ratingsAPI;
