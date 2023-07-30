import mongoose from "mongoose";
import CONFIG from "../utils/config.js";
import logger from "../utils/logger.js";

export default class DatabaseService {
  constructor() {
    mongoose.set("strictQuery", true);
    mongoose
      .connect(CONFIG.MONGO_URL)
      .then(() => logger.info("MongoDB Connected!!!"))
      .catch(err => logger.error("MongoDB Connection Failed -> error ", err));
  }

  static getInstance() {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }

    return DatabaseService.instance;
  }
}
