import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { inngest, functions } from './inngest/index.js';
import { serve } from 'inngest/express';
import { clerkMiddleware } from '@clerk/express';
import userRouter from './routes/userRouter.js';
import postRouter from './routes/postRouter.js';
import storyRouter from './routes/storyRouter.js';
import MessageRouter from './routes/messageRouter.js';

dotenv.config();
const app = express();

// --- CORS ---
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow server-to-server requests
    // allow localhost or any Vercel frontend preview domain
    if (origin === 'http://localhost:5173' || /\.vercel\.app$/.test(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Clerk middleware
app.use(clerkMiddleware());

// Connect DB
connectDB();

// Routes
app.get('/', (req, res) => res.send("Hello ping up"));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', MessageRouter);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
