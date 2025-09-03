import Comment from "../models/Comment.js";

export const postComment = async (req, res) => {
  try {
    const { userId } = req.auth;  // ✅ Clerk injects req.auth, not a function
    const { postId, text } = req.body;

    if (!userId || !postId || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // create comment
    const comment = await Comment.create({
      postId,
      user: userId,
      text,
    });

    // populate user info so frontend can show immediately
    const populated = await comment.populate("user");

    return res.json({
      success: true,
      message: "Comment Posted",
      comment: populated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const fetchComments = async (req,res)=>{
  try {
    const {postId} = req.body
    const comments = await Comment.find({postId}).sort({createdAt:-1})
        return res.json({ success: true,  comments});



    
  } catch (error) {
        return res.status(500).json({ success: false, message: error.message });

    
  }
}