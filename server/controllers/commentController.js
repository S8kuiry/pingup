import Comment from "../models/Comment.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const postComment = async (req, res) => {
  try {
    const { userId } = req.auth();  // Clerk injects req.auth
    const { postId, text } = req.body;

    if (!userId || !postId || !text) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Create comment
    const comment = await Comment.create({ postId, user: userId, text });

    // Fetch user details from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);

    // Attach necessary info for frontend
    const populatedComment = {
      _id: comment._id,
      postId: comment.postId,
      text: comment.text,
      user: {
        _id: clerkUser.id,
        full_name: clerkUser.firstName + " " + (clerkUser.lastName || ""),
        profile_picture: clerkUser.profileImageUrl,
      },
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };

    return res.json({
      success: true,
      message: "Comment Posted",
      comment: populatedComment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
import Comment from "../models/Comment.js";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const fetchComments = async (req, res) => {
  try {
    const { postId } = req.body;

    if (!postId) return res.status(400).json({ success: false, message: "PostId missing" });

    const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

    // Fetch Clerk user data for all comments
    const populatedComments = await Promise.all(
      comments.map(async (c) => {
        const user = await clerkClient.users.getUser(c.user);
        return {
          _id: c._id,
          postId: c.postId,
          text: c.text,
          user: {
            _id: user.id,
            full_name: user.firstName + " " + (user.lastName || ""),
            profile_picture: user.profileImageUrl,
          },
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        };
      })
    );

    return res.json({ success: true, comments: populatedComments });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
