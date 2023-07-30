import express from "express";
import UserService from "../../services/users.js";
import AuthenticationMiddleware from "../../middlewares/Authentication.js";

const router = express.Router();

router.get(
  "/me",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await UserService.me(request, response);
  }
);

router.post("/signin", async (request, response) => {
  return await UserService.signin(request, response);
});

router.post("/signup", async (request, response) => {
  return await UserService.signup(request, response);
});

export default router;
