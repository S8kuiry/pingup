
import fs from 'fs'
import imagekit from '../config/imagekit.js';
import Message from '../models/Message.js';
import { stringify } from 'querystring';

// create an empty object to store SS Event Connections

const connections = {};



//Controller life for the SSE endpoint
export const sseController = async (req, res) => {
    const { userId } = req.params
    console.log('New Client connected : ', userId)

    // set SSE  headers
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache'),
        res.setHeader('Conenction', 'keep-alive'),
        res.setHeader('Access-Control-Allow-Origin', '*')

    //Add the clients response object to the connections onject 
    connections[userId] = res
    //send an initial event to a client
    res.write(`log: Connected to SSE stream\n\n`)


    // handle client disconnection
    req.on('close', () => {
        delete connections[userId]
        console.log('Client Disconnected')
    })


}
// sendmessage ...
export const sendMessage = async (req, res) => {
    try {
        const { userId } = req.auth()
        const { to_user_id, text } = req.body
        const image = req.file

        let media_url = ''
        let message_type = image ? 'image' : 'text'

        if (message_type === "image") {
            const fileBuffer = fs.readFileSync(image.path)
            const response = await imagekit.upload({
                file: fileBuffer,
                fileName: image.originalname
            })
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
        }
        const message = await Message.create({
            from_user_id:userId,
            to_user_id,
            text,
            message_type,
            media_url,

        })
        return res.json({success:true,message})

        // send message to userid uinsg SSE 
        const messageWithUserData = await Message.findById(message._id).populate('from_user_id')
        if( connections[to_user_id]){
            connections[to_user_id].write(`data : ${JSON.stringify(messageWithUserData)}\n\n`)
        }


    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}
// get chat messages
export const getChatMessages  = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const {to_user_id} = req.body
        const messages = await Message.find({
            $or:[
                {from_user_id:userId,to_user_id},
                {from_user_id:to_user_id,to_user_id:userId} 
            ]
        }).sort({createdAt:-1})

        await Message.updateMany({from_user_id:to_user_id,to_user_id:userId},{seen:true})
        return res.json({success:true,messages})
        
    } catch (error) {
                return res.json({ success: false, message: error.message })

        
    }
}

//recent messages 
export const getUserRecentMessages =  async (req,res)=>{
    try {
        const {userId} = req.auth()
        const messages = await Message.find({to_user_id:userId,}).populate('from_user_id  to_user_id').sort({createdAt:-1})
                return res.json({success:true,messages})

        
    } catch (error) {
                        return res.json({ success: false, message: error.message })

        
    }
}