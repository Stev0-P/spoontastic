import { Router } from "express";
import CheckBox from "../../client/components/checkbox";

const preferencesControllers = require("../controllers/preferences-controller");

const router = Router();

router.get("/preferences/:pid", preferencesControllers.getPreferencesById);

router.post("/", preferencesControllers.createPreferences);

router.patch("/:pid", preferencesControllers.updatePreferences);

export default router;
