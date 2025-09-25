import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import cors from "cors";


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend dev URL
    credentials: true, // allow cookies to be sent
  })
);
app.use(cookieParser());

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

app.use(express.json()); //  red.body middleware to parse JSON request bodies

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend build in production
if (ENV.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(distPath));
  app.get("*", (_, res) => res.sendFile(path.join(distPath, "index.html")));
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectDB();
});
