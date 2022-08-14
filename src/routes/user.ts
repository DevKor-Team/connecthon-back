import express from 'express';
import * as Controller from '@/controllers/user';
import { checkAdmin } from '@/middlewares/auth';

const router = express.Router();

router.get('/', Controller.getList);
router.get('/:id', Controller.get);
router.put('/:id/profile', checkAdmin, Controller.updateProfile);
// router.put('/:id/team', Controller.updateTeam);

export default router;
