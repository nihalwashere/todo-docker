import TodosModel from "../models/Todos.js";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "../constants/App.js";
import logger from "../utils/logger.js";

const list = async (request, response) => {
  try {
    const todos = await TodosModel.find({ user: request?.user?._id });

    return response.status(200).json({ success: true, todos });
  } catch (error) {
    logger.error("TodoService - list() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const get = async (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    const todos = await TodosModel.findOne({
      _id: id,
      user: request?.user?._id
    });

    return response.status(200).json({ success: true, todos });
  } catch (error) {
    logger.error("TodoService - get() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const create = async (request, response) => {
  try {
    const { title, completed = false } = request.body;

    if (!title) {
      return response
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    const todo = await new TodosModel({ title, completed }).save();

    return response
      .status(200)
      .json({ success: true, todo, message: "Todo created successfully." });
  } catch (error) {
    logger.error("TodoService - create() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const update = async (request, response) => {
  try {
    const { id, title, completed } = request.body;

    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    if (!title) {
      return response
        .status(400)
        .json({ success: false, message: "Title is required." });
    }

    const todo = await TodosModel.findOneAndUpdate(
      { _id: id, user: request?.user?._id },
      {
        title,
        completed
      },
      { new: true }
    );

    return response
      .status(200)
      .json({ success: true, todo, message: "Todo updated successfully." });
  } catch (error) {
    logger.error("TodoService - update() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const deleteTodo = async (request, response) => {
  try {
    const { id } = request.params;

    if (!id) {
      return response
        .status(400)
        .json({ success: false, message: "ID is required." });
    }

    await TodosModel.findOneAndRemove({
      _id: id,
      user: request?.user?._id
    });

    return response
      .status(200)
      .json({ success: true, message: "Todo deleted successfully." });
  } catch (error) {
    logger.error("TodoService - delete() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const TodoService = {
  list,
  get,
  create,
  update,
  delete: deleteTodo
};

export default TodoService;
