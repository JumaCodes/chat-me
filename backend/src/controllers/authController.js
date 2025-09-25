import cloudinary from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import { ENV } from "../lib/env.js";
import { generateToken, generateEmailVerificationToken } from "../lib/utils.js";
import { sendVerificationEmail } from "../emails/emailhandlers.js";

export const SignUp = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const savedUser = await newUser.save();

    // Generate verification token
    const verifyToken = generateEmailVerificationToken(savedUser._id);

    // Send backend verification link
    const verifyUrl = `${ENV.SERVER_URL}/api/auth/verify-email?token=${verifyToken}`;

    await sendVerificationEmail({
      email: savedUser.email,
      name: savedUser.username,
      verifyUrl,
    });

    res.status(201).json({
      message: "Account created. Please check your email to verify.",
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const VerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Invalid verification link");

    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(400).send("Invalid token or user not found");

    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    // Generate JWT token and save in cookie
    generateToken(user._id, res);

    // Redirect to frontend chat page in the same tab
    res.redirect(`${ENV.CLIENT_URL}/?verified=true`);
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).send("Invalid or expired token");
  }
};


export const Login = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res
      .status(400)
      .json({ message: "Email/Username and password are required" });
  }


  try {
    // Find user by email OR username (case-insensitive for username)
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: { $regex: `^${identifier}$`, $options: "i" } },
      ],
    });

     if (!user.isVerified) {
       return res
         .status(403)
         .json({ message: "Please verify your email first" });
     }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token (your util function)
    const token = generateToken(user._id, res);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const Logout = async (_, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};


export const Profile = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture is required" });
    }

    const userId = req.user._id;

    // Upload profile picture (can be base64 or url)
    const uploadResult = await cloudinary.uploader.upload(profilePicture, {
      folder: "user_profiles",
      fetch_format: "auto",
      quality: "auto",
    });

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResult.secure_url },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }

    // Case-insensitive search
    const existingUser = await User.findOne({
      username: { $regex: `^${username}$`, $options: "i" },
    });

    if (existingUser) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });
  } catch (err) {
    console.error("Error checking username:", err);
    res.status(500).json({ error: "Server error" });
  }
};
