import express from "express";
import { SignUp } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", SignUp);

router.get("/login", (req, res) => {
  res.send("This is Login routes!");
});

router.get("/logout", (req, res) => {
  res.send("Oops, I am logged out!");
});

export default router;
