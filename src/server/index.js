import App from "../client/App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import apiRoutes from "./api";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);
//add MongoSession
const app = express();

/* 
.... Connect Mongo


*/
app
  .disable("x-powered-by")
  .use("/api", apiRoutes)
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  //.use(bodyParser.json())
  //.use("/dashboard/api", recipesRoutes)
  //.use("./preferences/api", preferencesRoutes)
  .use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message } || "An unknown error has occured!");
  })
  .get("/*", (req, res) => {
    const { context, html } = renderApp(req, res);
    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(html);
    }
  });

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css
          .map((asset) => `<link rel="stylesheet" href="${asset}">`)
          .join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js
          .map((asset) => `<script src="${asset}" ${extra.join(" ")}></script>`)
          .join("")
      : ""
    : "";
};

export const renderApp = (req, res) => {
  const context = {};
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App />
    </StaticRouter>
  );
  const html = `<!doctype html>
  <html lang="">
  <head>
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta charset="utf-8" />
      <title>Welcome to Razzle</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${cssLinksFromAssets(assets, "client")}
  </head>
  <body>
      <div id="root">${markup}</div>
      ${jsScriptTagsFromAssets(assets, "client", "defer", "crossorigin")}
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"/>
  </body>
</html>`;
  return { context, html };
};

export default app;
