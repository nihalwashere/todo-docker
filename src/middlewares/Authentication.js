import UsersModel from "../models/Users.js";
import JWT from "../utils/jwt.js";

const authenticate = async (request, response, next) => {
  try {
    const token = request.headers["x-access-token"];

    if (!token) {
      // eslint-disable-next-line
      throw {
        status: 401,
        success: false,
        message: "Invalid Request."
      };
    }

    const decoded = JWT.decodeJWT(token);

    if (!decoded || !decoded.userId) {
      // eslint-disable-next-line
      throw {
        status: 401,
        success: false,
        message: "Invalid Token."
      };
    }

    const user = await UsersModel.findById(decoded.userId);

    if (!user) {
      // eslint-disable-next-line
      throw {
        status: 401,
        error: true,
        message: "Access denied. User does not exist."
      };
    }

    request.user = user;
    request.userId = user._id;

    next();
  } catch (error) {
    return response
      .status(error.status)
      .json({ message: error.message, error: error.error });
  }
};

const AuthenticationMiddleware = {
  authenticate
};

export default AuthenticationMiddleware;
