import express from 'express';
import * as Controller from '@/controllers/team';

const router = express.Router();

router.get('/', Controller.getList);
router.post('/', Controller.create);
router.get('/:id', Controller.get);
router.put('/:id', Controller.update);
router.put('/:id/users', Controller.addUser);
router.put('/:id', Controller.deleteTeam);

// router.put('/:id/profile', Controller.updateProfile);
// router.put('/:id/team', Controller.updateTeam);

export default router;
