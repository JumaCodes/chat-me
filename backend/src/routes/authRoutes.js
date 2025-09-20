import express from "express";
import { Login, Logout, Profile, SignUp } from "../controllers/authController.js";
import { Protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);
router.post("/logout", Logout);


router.put("/update-profile", Protect, Profile);
router.get("/check", Protect, (req, res) => { res.status(200).json({ user: req.user, message: "Token is valid" })}); 


export default router;
