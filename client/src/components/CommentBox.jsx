import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import { api } from "../api/axios.js";

const CommentBox = ({ postId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      const { data } = await api.post("/api/comment/get", { postId });
      setComments(data.comments || []);
    } catch (error) {
      toast.error("Failed to load comments");
    }
  };

  // Post comment (optimistic update)
  const postComment = async () => {
    if (!text.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    const newComment = {
      _id: `temp-${Date.now()}`, // temporary ID
      text,
      user: currentUser,
      createdAt: new Date().toISOString(),
      isTemp: true, // flag for optimistic update
    };

    // Optimistically add comment to UI
    setComments((prev) => [newComment, ...prev]);
    setText("");
    setLoading(true);

    try {
      const token = await getToken();
      const { data } = await api.post(
        "/api/comment/add",
        { postId, text: newComment.text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.comment) {
        // Replace temporary comment with actual one
        setComments((prev) =>
          prev.map((c) => (c._id === newComment._id ? data.comment : c))
        );
      }
    } catch (error) {
      // Remove failed comment
      setComments((prev) => prev.filter((c) => c._id !== newComment._id));
      toast.error("Failed to post comment");
    } finally {
      setLoading(false);
    }
  };

  // Fetch comments on mount & periodically
  useEffect(() => {
    fetchComments();
    const interval = setInterval(fetchComments, 5000); // fetch every 5s
    return () => clearInterval(interval);
  }, [postId]);

  return (
    <div className="w-full min-h-[300px] py-3 flex flex-col">
      {/* Input Section */}
      <div className="flex gap-3 items-center border border-gray-300 rounded px-2 py-1">
        <input
          type="text"
          className="flex-1 outline-none border-none bg-transparent"
          placeholder="Enter your comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && postComment()}
        />
        <button
          onClick={postComment}
          className="px-4 py-2 bg-purple-800 text-white rounded flex items-center justify-center active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Post"}
        </button>
      </div>

      {/* Comments List */}
      <div className="mt-4 flex flex-col gap-4 overflow-y-auto max-h-[400px]">
        {comments.length ? (
          comments.map((comment) => (
            <div
              key={comment._id}
              className={`p-3 bg-gray-100 rounded shadow ${
                comment.isTemp ? "opacity-70 animate-pulse" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={comment.user?.profile_picture || "/profile_default.jpeg"}
                  alt={comment.user?.full_name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="font-bold text-sm">{comment.user?.full_name}</span>
                  <span className="text-gray-500 text-xs">@{comment.user?._id}</span>
                </div>
                {comment.user?._id === currentUser._id && !comment.isTemp && (
                  <button
                    onClick={() => console.log("Delete", comment._id)}
                    className="ml-auto text-red-500 text-xs"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="text-gray-800">{comment.text}</p>
              <span className="text-gray-400 text-xs mt-1">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
