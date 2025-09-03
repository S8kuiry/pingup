

import { fetchComments, postComment } from "../controllers/commentController.js"
import express from 'express'
import { protect } from "../middleware/auth.js"

const commentRouter = express.Router()
commentRouter.post('/add',protect,postComment)
commentRouter.post('/get',fetchComments)


export default commentRouter;