import { Router } from "express";
import bodyParser from "body-parser";
import recipesAPI from "./recipesAPI";
import favouritesAPI from "./favouritesAPI";
import accountAPI from "./accountAPI";
import preferencesAPI from "./preferencesAPi";

const app = Router();
app.use(bodyParser.json({ limit: "500mb" }));

app.use("/recipes", recipesAPI);
app.use("/favourites", favouritesAPI);
app.use("/account", accountAPI);
app.use("/preferences", preferencesAPI);

export default app;
