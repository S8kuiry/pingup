
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import {inngest,functions} from './inngest/index.js'




// app initialise
dotenv.config()
const app =  express()

//middleware
app.use(cors())
app.use(express.json())

//port
const PORT = process.env.PORT

//db connect 
connectDB()

//send
app.get('/',(req,res)=>{
res.send("Hello ping up")
    
})
app.use('/api/inngest',serve({ client: inngest, functions }))
//listen
app.listen(PORT,()=>{
    console.log("Successfully running on port "+PORT)

})
