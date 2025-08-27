
import mongoose from 'mongoose'

const connectionSchema = mongoose.Schema({
    from_user_id:{type:String, ref:'User',required:true},
    to_user_id:{type:String,ref:'User',required:true},
    status:{type:String,enum:['pending','accepted'],default:'pending'}

},{timestamps:true})

const Connenction = mongoose.model('connection',connectionSchema)

export default Connenction