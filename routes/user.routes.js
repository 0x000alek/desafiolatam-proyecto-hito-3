import { Router } from 'express';

import authMiddleware from '../middlewares/auth.middleware.js';
import userController from '../src/controllers/user.controller.js';

const router = Router();

router.get(
  '/:profileId',
  authMiddleware.verifyToken(),
  authMiddleware.verifyProfileAccess(),
  userController.findUserProfileById
);

export default router;
