import crypto from "crypto";
import UsersModel from "../models/Users.js";
import { INTERNAL_SERVER_ERROR_MESSAGE } from "../constants/App.js";
import JWT from "../utils/jwt.js";
import logger from "../utils/logger.js";

const me = (request, response) => {
  try {
    return response.status(200).json({
      data: {
        user: request.user
      }
    });
  } catch (error) {
    logger.error("UserService - me() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const signup = async (request, response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    } = request.body;

    if (!firstName) {
      return response
        .status(400)
        .json({ success: false, message: "First name is required." });
    }

    if (!lastName) {
      return response
        .status(400)
        .json({ success: false, message: "Last name is required." });
    }

    if (!email) {
      return response
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!password) {
      return response
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    if (!confirmPassword) {
      return response
        .status(400)
        .json({ success: false, message: "Confirm password is required." });
    }

    const user = await new UsersModel({
      firstName,
      lastName,
      email,
      password: JWT.hash(password, JWT.createSalt()),
      avatar: crypto
        .createHash("md5")
        .update(email)
        .digest("hex")
    }).save();

    return response.status(200).json({
      data: {
        user,
        token: JWT.encode({ userId: user?._id })
      }
    });
  } catch (error) {
    logger.error("UserService - signup() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const signin = async (request, response) => {
  try {
    const { email, password } = request.body;

    if (!email) {
      return response
        .status(400)
        .json({ success: false, message: "Email is required." });
    }

    if (!password) {
      return response
        .status(400)
        .json({ success: false, message: "Password is required." });
    }

    const user = await UsersModel.findOne({ email });

    if (!user) {
      return response.status(400).json({
        success: false,
        message:
          "User with email does not exist. Please check your credentials and try again."
      });
    }

    const salt = user.password.split("$")[0];

    const hashedPassword = JWT.hash(password, salt);

    if (hashedPassword !== user.password) {
      return response.status(403).json({
        success: false,
        message: "Incorrect password. Please try again."
      });
    }

    const token = JWT.encode({ userId: user._id });

    return response.status(200).json({ data: { user, token } });
  } catch (error) {
    logger.error("UserService - signin() -> error : ", error);
    return response
      .status(400)
      .json({ success: false, message: INTERNAL_SERVER_ERROR_MESSAGE });
  }
};

const UserService = {
  me,
  signin,
  signup
};

export default UserService;
