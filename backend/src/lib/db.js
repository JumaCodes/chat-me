import mongoose from 'mongoose';

export const connectDB = async () => { 
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 MongoDB connected 🚀");
  } catch (error) {
    console.error("❌Error processing MongoDB:", error);
    process.exit(1);
  }
};
