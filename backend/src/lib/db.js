import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => { 
  try {
    const { MONGO_URI } = ENV;
    if (!MONGO_URI) { 
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    await mongoose.connect(MONGO_URI);
    console.log("🚀 MongoDB connected 🚀");
  } catch (error) {
    console.error("❌Error processing MongoDB:", error);
    process.exit(1);
  }
};
