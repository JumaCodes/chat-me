import express from "express";
import { getAllContacts, getChatPartners, getMessagesByUserId, sendMessage } from "../controllers/messageController.js";
import { Protect } from "../middlewares/authMiddleware.js";
import { arcjetProtection } from "../middlewares/arcjetMiddleware.js";

const router = express.Router();
router.use(arcjetProtection, Protect);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);

router.post("/send/:id", sendMessage);

export default router;
