import App from "../client/App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import apiRoutes from "./api";
import mongoose from "mongoose";
import session from "express-session";
import MongoDBSession from "connect-mongodb-session";
import userSchema from "./services/users/user.model";
import { renderApp } from "./utils";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
//add MongoSession
const MongoDBStore = MongoDBSession(session);
const app = express();

/* 
.... Connect Mongo
*/
mongoose.connect(
  "mongodb://admin:password@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256"
);
mongoose.set("returnOriginal", false);
mongoose.set("toJSON", { virtuals: true });
mongoose.set("toObject", { virtuals: true });
mongoose.connection
  .on("open", () => console.info("MongoDB Connection Open"))
  .on("error", () => console.log("there has been an error"));
const cast = mongoose.Schema.Types.Boolean.cast();
mongoose.Schema.Types.Boolean.cast(() => cast(typeof value === "string" && !value ? null : value));

app.use(
  session({
    secret: "thisismysecret101",
    resave: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
    store: new MongoDBStore({
      uri: "mongodb://admin:password@localhost:27017/?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-256",
      collection: "sessions",
    }),
  })
);

app
  .disable("x-powered-by")
  .use("/api", apiRoutes)
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message } || "An unknown error has occured!");
  })
  .get("/*", async (req, res) => {
    const { context, html } = await renderApp(req, res);
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(html);
    }
  });

export default app;
