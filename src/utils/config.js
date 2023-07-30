import dotenv from "dotenv";

dotenv.config();

const MONGO_URL = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongo:${process.env.MONGODB_LOCAL_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`;

const Config = {
  PORT: process.env.PORT || 7000,
  APP_ENV: process.env.APP_ENV,
  LOG_LEVEL: process.env.LOG_LEVEL,
  MONGO_URL,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY
};

export default Config;
