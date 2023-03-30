import { Router } from "express";
import { v4 as uuid4 } from "uuid";
import mongoose from "mongoose";
import userRatingsSchema from "../services/reccomender/reccomender.model";
import userSchema from "../services/users/user.model";
import { PlaceSharp } from "@mui/icons-material";

const ratingsAPI = Router();

ratingsAPI.get("/:uid/:rid", async (req, res, next) => {
  const userID = req.params.uid;
  const recipeID = req.params.rid;

  let ratings;

  try {
    ratings = await userRatingsSchema.find({ creator: userID, recipeID: recipeID });
    console.log(ratings);
  } catch (err) {
    const error = new Error("Something went wrong!");
    error.code = 500;
    console.log(err);
    return next(error);
  }
  res.json({ rating: ratings.map((rating) => rating.toObject({ getters: true })) });

  //console.log(res)
});

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
    rat = await userRatingsSchema.findOne({ recipeID: recipeID });
  } catch (err) {
    const error = new Error("Adding to Favourites failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  if (!user) {
    const error = new Error("Could not find user for provided id.");
    error.code = 404;
    return next(error);
  }

  try {
    if (rat === null) {
      await addedRating.save();
      user.ratings.push(addedRating);
      await user.save();
    } else if (rat !== null) {
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
    const error = new Error("Adding to Favourites failed!");
    console.log(err);
    error.code = 500;
    return next(error);
  }

  res.status(201).json({ rating: addedRating });
});

export default ratingsAPI;
