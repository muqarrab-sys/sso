import logger from "@Infrastructure/Utils/logger";
import mongoose from "mongoose";

class MongoDatabase {
  async connect() {
    try {
      await mongoose.connect(process.env.DATABASE_URL);
      logger.info("Database Connected");
    } catch (error) {
      logger.error(error);
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect();
      logger.info("Database disconnected");
    } catch (error) {
      logger.error(error);
    }
  }
}

export default MongoDatabase;
