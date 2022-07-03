import express from 'express';
import * as Controller from '@/controllers/user';

const router = express.Router();

router.get('/:id', Controller.get);
router.put('/:id/profile', Controller.updateProfile);
// router.put('/:id/team', Controller.updateTeam);

export default router;
