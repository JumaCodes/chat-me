import express from "express";

const router = express.Router();

router.get("/message", (req, res) => {
  res.send("Signup route works!");
});

router.get("/login", (req, res) => {
  res.send("This is Sign In");
});

router.get("/logout", (req, res) => {
  res.send("Oops, I am logged out!");
});

export default router;
