import imagekit from "../config/imagekit.js";
import { inngest } from "../inngest/index.js";
import Connenction from "../models/Connection.js";
import Connection from "../models/Connection.js";
import Post from "../models/Post.js";
import User from "../models/user.js";
import fs from 'fs'


//get userData  data from userId
export const getUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }
        return res.json({ success: true, user })


    } catch (error) {
        return res.json({ success: false, message: error.message })


    }
}

// update user data
export const updateUserData = async (req, res) => {
    try {
        const { userId } = req.auth();
        let { username, bio, location, full_name } = req.body

        const tempUser = await User.findById(userId)

        !username && (username = tempUser.username);
        if (tempUser.username !== username) {
            const user = await User.findOne({ username })
            if (user) {
                username = tempUser.username
            }

        }
        const updatedData = {
            username,
            bio,
            location,
            full_name
        }
        const profile = req.files.profile && req.files.profile[0]
        const cover = req.files.cover && req.files.cover[0]

        if (profile) {
            //convert image to buffer
            const buffer = fs.readFileSync(profile.path)
            //upload image to imagekit
            const response = await imagekit.upload({
                file: buffer,
                fileName: profile.originalname
            })
            //generate the image url endpoint
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '512' }
                ]
            })
            updatedData.profile_picture = url;

        }

        if (cover) {
            //cobver the image to buffer
            const buffer = fs.readFileSync(cover.path)

            //upload image to imagekit
            const response = await imagekit.upload({
                file: buffer,
                fileName: cover.originalname,

            })

            //geting the url of stored image form imagekit
            const url = imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto' },
                    { format: 'webp' },
                    { width: '1280' }
                ]
            })
            updatedData.cover_photo = url;
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true })
        return res.json({ success: true, updatedUser })


    } catch (error) {
        return res.json({ success: false, message: error.message })


    }
}

//find users using email location name username
export const discoverUsers = async (req, res) => {
    try {
        const userId = req.userId;
        const { input } = req.body
        const allUsers = await User.find({
            $or: [
                { username: new RegExp(input, 'i') },
                { email: new RegExp(input, 'i') },
                { full_name: new RegExp(input, 'i') },
                { location: new RegExp(input, 'i') }
            ]
        })
        const filteredUsers = allUsers.filter(user => user._id !== userId)
        return res.json({ success: true, filteredUsers })


    } catch (error) {
        return res.json({ success: false, message: error.message })


    }
}

// followrs following list 
export const followUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body

        const user = await User.findById(userId)
        if (user.following.includes(id)) {
            return res.json({ success: false, message: "You are already following this User" })
        }
        user.following.push(id)
        await user.save()

        const toUser = await User.findById(id)
        toUser.followers.push(userId)
        await toUser.save()
        return res.json({ success: true, message: "Now you are following the User " })




    } catch (error) {
        return res.json({ success: false, message: error.message })

    }
}

// unfollow user
export const unfollowUser = async (req, res) => {
    try {
        const userId = req.userId;
        const { id } = req.body

        const user = await User.findById(userId)
        if (user.following.includes(id)) {
            user.following = await user.following.filter(u_id => u_id !== id)
            await user.save()

            const toUser = await User.findById(id)
            toUser.followers = await user.followers.filter(u_id => u_id !== userId)

            return res.json({ success: true, message: "You have unfollowed the User" })


        } else {
            return res.json({ success: true, message: "You are not following the User" })


        }



    } catch (error) {
        return res.json({ success: false, message: error.message })


    }


}
// send connection request ......
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const connectionRequests = await Connection.find({
      from_user_id: userId,
      createdAt: { $gt: last24Hours }
    });

    if (connectionRequests.length >= 20) {
      return res.json({
        success: false,
        message: "You have sent more than 20 connection requests in the last 24 hours"
      });
    }

    const connection = await Connection.findOne({
      $or: [
        { from_user_id: userId, to_user_id: id },
        { from_user_id: id, to_user_id: userId }
      ]
    });

    if (!connection) {
       const newConnection = await Connection.create({
        from_user_id: userId,
        to_user_id: id
      });
      await inngest.send({
        name:'app/connection-request',
        data:{connenctionId : newConnection._id}
      }) 
      

      return res.json({ success: true, message: "Connection Request Sent Successfully" });
    } else if (connection.status === "accepted") {
      return res.json({ success: false, message: "You are already connected with this user" });
    }

    return res.json({ success: false, message: "Connection request Pending" });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// get user connections 
export const getUserConnections = async(req,res)=>{
    try {
        const {userId} = req.auth()
        const user = await User.findById(userId).populate('connections followers following')
        const connections = user.connections
        const followers = user.followers
        const  following = user.following

        const pendingConnections = (await Connection.find({to_user_id:userId,status:"pending"}).populate('from_user_id').map(connection => connection.from_user_id))
        res.json({success:true,connections,followers,following,pendingConnections})
        
    } catch (error) {
            return res.json({ success: false, message: error.message });


        
    }
}

//accept connection request 
export const acceptConnectionRequest = async (req,res)=>{
    try {
        const {userId} = req.auth()
        const {id} = req.body

        const connection = await User.findOne({from_user_id:id,to_user_id:userId})

        if(!connection){
            return res.json({success:false,message:"No Connection found"})
            
        }
        const user = await User.findById(userId)
        user.connections.push(id)
        await user.save()

        const toUser =  await User.findById(id)
        toUser.connections.push(userId)
        await toUser.save()


        connection.status = "accepted"
        await connection.save()
        return res.json({success:true,message:"Connection accepted successfully"})

    } catch (error) {
                    return res.json({ success: false, message: error.message });

        
    }
}
// get user profiles
export const getUserProfiles = async (req,res)=>{
    try {
        const {profileId} = req.body
        const profile  = await User.findById(profileId)
        if( !profile){
            return res.json({success:false,message:"Profile Not Found"})
        }
        const posts = await Post.findById({user:profileId}).populate('user')
        return res.json({success:true,profile,posts})
        
    } catch (error) {
         return res.json({ success: false, message: error.message });

    }
}