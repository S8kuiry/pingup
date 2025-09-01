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

const allowedOrigins = [
  'https://pingup-client-indol.vercel.app', // frontend
  'http://localhost:5173',                 // local dev
];

// ✅ 1. Apply CORS BEFORE Clerk middleware
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// ✅ 2. Explicitly handle OPTIONS requests (preflight)
app.options('*', cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// ✅ 3. Parse JSON
app.use(express.json());

// ✅ 4. Clerk middleware
app.use(clerkMiddleware());

// ✅ 5. Connect to DB
connectDB();

// ✅ 6. Routes
app.get('/', (req,res) => res.send("Hello ping up"));
app.use('/api/inngest', serve({ client: inngest, functions }));
app.use('/api/user', userRouter);
app.use('/api/post', postRouter);
app.use('/api/story', storyRouter);
app.use('/api/message', MessageRouter);

// ✅ 7. Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
