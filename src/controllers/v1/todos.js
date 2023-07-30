import express from "express";
import TodoService from "../../services/todos.js";
import AuthenticationMiddleware from "../../middlewares/Authentication.js";

const router = express.Router();

router.get(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await TodoService.list(request, response);
  }
);

router.get(
  "/:id",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await TodoService.get(request, response);
  }
);

router.post(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await TodoService.create(request, response);
  }
);

router.put(
  "/",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await TodoService.update(request, response);
  }
);

router.delete(
  "/:id",
  AuthenticationMiddleware.authenticate.bind(),
  async (request, response) => {
    return await TodoService.delete(request, response);
  }
);

export default router;
