import { sendWelcomeEmail } from "../emails/emailhandlers.js";
import { ENV } from "../lib/env.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // ✅ Validate required fields
    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // ✅ Password validation
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long." });
    }

    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({
        message: "Password must include at least one uppercase letter.",
      });
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return res.status(400).json({
        message: "Password must include at least one special character.",
      });
    }

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // ✅ Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // ✅ Check if username already exists
    // Check if username exists (case-insensitive)
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${username}$`, "i") },
    });

    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken." });
    }

    // ✅ Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ✅ Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      // ✅ Generate JWT token and set cookie
      generateToken(savedUser._id, res);

      // ✅ Send response
      res.status(201).json({
        message: "User registered successfully!",
        _id: savedUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        email: newUser.email,
        profilePicture: newUser.profilePicture,
      });

      try {
        await sendWelcomeEmail({
          email: savedUser.email,
          name: savedUser.username,
          clientURL: ENV.CLIENT_URL,
        });
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const Login = async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ message: "Email/Username and password are required" });
  }


  try {
    // Find user by email OR username
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token (assuming you already have a util for this)
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
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const Logout = async (_, res) => { 
  res.cookie("token", "", { maxAge: 0 });
  res.status(200).json({message: "Logged out successfully"})
};
