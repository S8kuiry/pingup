

import express from 'express'
import { addUserStory, getStories } from '../controllers/StoryController.js';
import { protect } from '../middleware/auth.js';

const storyRouter  = express.Router();
storyRouter.post('/create',protect,addUserStory)
storyRouter.get('/get',protect,getStories)
export default storyRouter;