import express from "express";
import morgan from "morgan";
import expressRequestId from "express-request-id";
import cors from "cors";

// services
import DatabaseService from "./services/db.js";

// controllers
import users from "./controllers/v1/users.js";
import todos from "./controllers/v1/todos.js";

// utils
import Config from "./utils/config.js";
import logger from "./utils/logger.js";

const app = express();

app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

app.use(expressRequestId());

morgan.token("requestId", request => request.id);

app.use(
  morgan(":requestId :method :url :status :response-time ms", {
    stream: {
      write: message => logger.http(message)
    }
  })
);

const rawBodySaver = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(express.json({ verify: rawBodySaver, limit: "50mb" }));
app.use(
  express.urlencoded({ verify: rawBodySaver, extended: true, limit: "50mb" })
);
app.use(express.raw({ verify: rawBodySaver, type: "*/*", limit: "50mb" }));

const whitelist = ["http://localhost:3000", "https://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (whitelist.indexOf(origin) === -1) {
        return callback(
          new Error(
            "The CORS policy for this site does not allow access from the specified Origin."
          ),
          false
        );
      }

      return callback(null, true);
    },
    exposedHeaders: "x-access-token"
  })
);

// ROUTES

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Howdy!!!" });
});

app.use("/v1/users", users);
app.use("/v1/todos", todos);

app.listen(Config.PORT, () => {
  try {
    logger.info(`App is now running on port ${Config.PORT}!!!`);

    console.debug("MONGODB_USER : ", process.env.MONGODB_USER);
    console.debug("MONGODB_PASSWORD : ", process.env.MONGODB_PASSWORD);
    console.debug("MONGODB_LOCAL_PORT : ", process.env.MONGODB_LOCAL_PORT);
    console.debug("MONGODB_DATABASE : ", process.env.MONGODB_DATABASE);

    console.debug("PORT : ", process.env.PORT);
    console.debug("APP_ENV : ", process.env.APP_ENV);
    console.debug("JWT_SECRET_KEY : ", process.env.JWT_SECRET_KEY);

    DatabaseService.getInstance(); // init database
  } catch (error) {
    logger.error("Failed to start server -> error : ", error);
  }
});
