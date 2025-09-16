import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"; 
import messageRoutes from "./routes/messageRoutes.js"; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
// Now your routes are:
// GET /api/auth/signup
// GET /api/auth/signin
// GET /api/auth/logout

// Example route
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
