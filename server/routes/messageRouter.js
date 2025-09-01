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


MessageRouter.get("/:userId",  sseController);

MessageRouter.post(
  "/send",
  
  upload.single("image"), protect,
  sendMessage
);


MessageRouter.post("/get", protect, getChatMessages);


MessageRouter.get("/recent", protect, getUserRecentMessages);

export default MessageRouter;
