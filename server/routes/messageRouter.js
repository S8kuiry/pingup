

import express from 'express'
import { protect } from '../middleware/auth.js'
import { getChatMessages, sendMessage, sseController } from '../controllers/messageController.js'
import { upload } from '../config/multer.js'


const MessageRouter = express.Router()

MessageRouter.get('/:userId',sseController)
MessageRouter.post('/send',upload.single('image'),protect,sendMessage)
MessageRouter.post('/get',protect,getChatMessages)



export default MessageRouter
