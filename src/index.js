import serverlessExpress from "@vendia/serverless-express";
import express from "express";

// this require is necessary for server HMR to recover from error
// tslint:disable-next-line:no-var-requires
let app, serverlessExpressInstance;
const loadServer = () => {
  app = require("./server").default;
  serverlessExpressInstance = serverlessExpress({ app });
};

loadServer();
if (module.hot) {
  module.hot.accept("./server", () => {
    console.log("🔁  HMR Reloading `./server`...");
    try {
      loadServer();
    } catch (error) {
      console.error(error);
    }
  });
  console.info("✅  Server-side HMR Enabled!");
}

export const handler = async (event, context, callback) => {
  try {
    return serverlessExpressInstance(event, context, callback);
  } catch (error) {
    console.error("Error in lambda handler", error);
    callback(error);
  }
};

export const start = () => {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  express()
    .use((req, res) => app(req, res))
    .listen(port, () => {
      console.log(`> Started on port ${port}`);
    });
};

if (process.env.NODE_ENV !== "production") start();
