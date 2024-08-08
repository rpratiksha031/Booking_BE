const express = require("express");

const {
  CreateNewUserController,
  SigninUserController,
} = require("./../controller/User.Cotroller");

const AuthenticationRouter = express.Router();

AuthenticationRouter.post("/signup", CreateNewUserController);

AuthenticationRouter.get("/signin", SigninUserController);
module.exports = AuthenticationRouter;
