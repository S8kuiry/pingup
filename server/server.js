
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import {inngest,functions} from './inngest/index.js'
import { serve } from 'inngest/express'   // ✅ Add this import
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRouter.js'
import postRouter from './routes/postRouter.js'
import storyRouter from './routes/storyRouter.js'
import MessageRouter from './routes/messageRouter.js'






// app initialise
dotenv.config()
const app =  express()

//middleware
const allowedOrigins = [
  'https://pingup-client-indol.vercel.app', // your frontend
  'http://localhost:5173'                   // local dev
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json())
app.use(clerkMiddleware())

//port
const PORT = process.env.PORT

//db connect 
connectDB()

//send
app.get('/',(req,res)=>{
res.send("Hello ping up")
    
})
app.use('/api/inngest',serve({ client: inngest, functions }))
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)
app.use('/api/story',storyRouter)
app.use('/api/message',MessageRouter)
//listen
app.listen(PORT,()=>{
    console.log("Successfully running on port "+PORT)

})
