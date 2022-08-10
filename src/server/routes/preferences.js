import { Router } from "express";
import CheckBox from "../../client/components/checkbox";

const preferencesControllers = require('../controllers/preferences');

const router = Router();

router.post('/', preferencesControllers.createPreference);

export default router;
