
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import {inngest,functions} from './inngest/index.js'
import { serve } from 'inngest/express'   // ✅ Add this import
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/userRouter.js'






// app initialise
dotenv.config()
const app =  express()

//middleware
app.use(cors())
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
//listen
app.listen(PORT,()=>{
    console.log("Successfully running on port "+PORT)

})
