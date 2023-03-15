import App from "../client/App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import { renderToString } from "react-dom/server";
import userSchema from "./services/users/user.model";
import userPreferencesSchema from "./services/preferences/preferences.model";
import stringify from "safe-stable-stringify";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const cssLinksFromAssets = (assets, entrypoint) => {
  return assets[entrypoint]
    ? assets[entrypoint].css
      ? assets[entrypoint].css.map((asset) => `<link rel="stylesheet" href="${asset}">`).join("")
      : ""
    : "";
};

const jsScriptTagsFromAssets = (assets, entrypoint, ...extra) => {
  return assets[entrypoint]
    ? assets[entrypoint].js
      ? assets[entrypoint].js.map((asset) => `<script src="${asset}" ${extra.join(" ")}></script>`).join("")
      : ""
    : "";
};

export const renderApp = async (req, res) => {
  const objectId = req.session.user ?? "";
  const myObjectUserId = objectId.toString();
  const user = !req.session.user ? null : await userSchema.findById(myObjectUserId);
  const userPreferences = !req.session.user ? null : await userPreferencesSchema.findOne({ creator: myObjectUserId });

  if (req.session.user && !user) {
    await req.session.asyncDestroy();
    return res.redirect("/");
  }

  const context = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    picture: user?.picture ?? "",
    diet: user?.diet ?? "",
    intolerances: user?.intolerances ?? "",
    type: userPreferences?.type ?? "",
    userID: user?.id ?? " ",
  };

  const preloadedState = context; //pass a prop within <App />
  const markup = renderToString(
    <StaticRouter context={context} location={req.url}>
      <App state={preloadedState} />
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
        <script>
        window.__PRELOADED_STATE__ = ${stringify(preloadedState)}
        </script>
    </body>
  </html>`;
  return { context, html };
};
