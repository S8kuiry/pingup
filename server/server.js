import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express"; // ✅
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRouter.js";
import postRouter from "./routes/postRouter.js";
import storyRouter from "./routes/storyRouter.js";
import MessageRouter from "./routes/messageRouter.js";

dotenv.config();
const app = express();

// ✅ CORS fix
app.use(
  cors({
    origin: "https://pingup-client-indol.vercel.app", // your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Allow preflight (OPTIONS) requests globally
app.options("*", cors());

app.use(express.json());

// ✅ Clerk auth middleware
app.use(clerkMiddleware());

// ✅ Connect DB
connectDB();

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Hello ping up");
});

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", MessageRouter);

// ✅ SSE fix inside message router (important!)
/*
Example inside MessageRouter:
res.setHeader("Access-Control-Allow-Origin", "https://pingup-client-indol.vercel.app");
res.setHeader("Access-Control-Allow-Credentials", "true");
*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port " + PORT);
});
