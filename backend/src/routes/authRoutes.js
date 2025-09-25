import express from "express";
import {
  checkUsername,
  Login,
  Logout,
  Profile,
  SignUp,
  VerifyEmail,
} from "../controllers/authController.js";
import { Protect } from "../middlewares/authMiddleware.js";
import { arcjetProtection } from "../middlewares/arcjetMiddleware.js";

const router = express.Router();

// router.use(arcjetProtection);

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", Logout);


router.put("/update-profile", Protect, Profile);
router.get("/check-username", checkUsername);
router.get("/verify-email", VerifyEmail);
router.get("/check", Protect, (req, res) => { res.status(200).json({ user: req.user, message: "Token is valid" })});


export default router;
