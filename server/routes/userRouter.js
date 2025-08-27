import express from 'express'
import {
  getUserData,
  discoverUsers,
  followUser,
  unfollowUser,
  updateUserData,
  sendConnectionRequest,
  acceptConnectionRequest,
  getUserConnections
} from '../controllers/userController.js'
import { protect } from '../middleware/auth.js'
import { upload } from '../config/multer.js'

const userRouter = express.Router()

userRouter.get('/data', protect, getUserData)  // ✅ no ()
userRouter.post(
  '/update',
  upload.fields([{ name: 'profile', maxCount: 1 }, { name: 'cover', maxCount: 1 }]),
  protect,
  updateUserData
)
userRouter.post('/discover', protect, discoverUsers) // ✅ no ()
userRouter.post('/follow', protect, followUser)      // ✅ no ()
userRouter.post('/unfollow', protect, unfollowUser)  // ✅ no ()
userRouter.post('/connect',protect,sendConnectionRequest)
userRouter.post('/accept',protect,acceptConnectionRequest)
userRouter.get('/connections',protect,getUserConnections)




export default userRouter
