import App from "./App";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { hydrate } from "react-dom";

hydrate(
  <BrowserRouter>
    <App user={window.__PRELOADED_STATE__} />
  </BrowserRouter>,

  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
