import { v4 as uuid4 } from "uuid";
import { Router } from "express";

const accountAPI = Router();

const DUMMY_USERS = [
  {
    id: "1",
    name: "Oran Doherty",
    email: "oran.doherty@wearenova.co.uk",
  },
];

accountAPI.get("/getUsers", (req, res, next) => {
  res.json({ users: DUMMY_USERS });
});

accountAPI.post("/createUser", (req, res, next) => {
  const { name, email } = req.body;

  const createdUser = {
    id: uuid4(),
    name: name,
    email: email,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
});

accountAPI.post("/login", (req, res, next) => {
  const { email } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser) {
    const error = new Error("Could not identify user, credentials seem to be wrong.");
    error.code = 401;
    return next(error);
  }
  res.json({ message: "Logged in!" })
});

export default accountAPI;
