import express from 'express';
import * as Controller from '@/controllers/team';
import {
  isInTeam,
  isAdmin,
  checkAdmin,
  isParticipant,
} from '@/middlewares/auth';

const router = express.Router();

router.get('/', Controller.getList);
router.post('/', isAdmin, Controller.create);
router.get('/:id', Controller.get);
router.put('/:id/users', isParticipant, Controller.addUser);
router.put('/:id', checkAdmin, isInTeam, Controller.update);
router.put('/:id', isAdmin, Controller.deleteTeam);

export default router;
