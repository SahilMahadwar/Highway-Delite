import mongoose from "mongoose";
import { env } from "../utils/env";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(env.MONGODB_URL, {
      dbName: "highwaydelite",
    });

    console.log(`📡[Mongodb]: DB Connected host: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
  }
};
