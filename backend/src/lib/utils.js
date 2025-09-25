import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV; 
    if (!JWT_SECRET) { 
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true, // Accessible only by web server
      sameSite: "Strict", // CSRF protection
      secure: ENV.NODE_ENV === "development" ? false : true, // Set to true in production
    });

    return token;
};
 

export const generateEmailVerificationToken = (userId) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  // shorter expiry for email verification
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
};
