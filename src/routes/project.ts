import express from 'express';
import * as Controller from '@/controllers/project';
import {
  isParticipant,
  isAdmin,
  isInTeam,
} from '@/middlewares/auth';

const router = express.Router();

router.get('/', Controller.getList);
router.get('/:id', Controller.get); // team id

router.post('/create/:id', isInTeam, Controller.create); // team id
router.put('/update/:id', isInTeam, Controller.update); // team id
router.delete('/delete/:id', isAdmin, Controller.remove); // project id
router.put('/like', isParticipant, Controller.like);
router.get('/like/:team/:user', Controller.alreadyLikes);

export default router;
