import express from "express";
import { protect } from "../middleware/auth.js";
import { 
  getChatMessages, 
  sendMessage, 
  sseController,
  getUserRecentMessages
} from "../controllers/messageController.js";
import { upload } from "../config/multer.js";

const MessageRouter = express.Router();

/**
 * @desc SSE stream for real-time messages
 * @route GET /api/message/stream/:userId
 * @access Private
 */
MessageRouter.get("/stream/:userId", protect, sseController);

/**
 * @desc Send a message (text or image)
 * @route POST /api/message/send
 * @access Private
 */
MessageRouter.post(
  "/send",
  protect,
  upload.single("image"), 
  sendMessage
);

/**
 * @desc Get chat messages between logged in user and another user
 * @route POST /api/message/get
 * @access Private
 */
MessageRouter.post("/get", protect, getChatMessages);

/**
 * @desc Get recent messages for logged in user
 * @route GET /api/message/recent
 * @access Private
 */
MessageRouter.get("/recent", protect, getUserRecentMessages);

export default MessageRouter;
