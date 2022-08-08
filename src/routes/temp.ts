import express from 'express';
import * as Controller from '@/controllers/temp';
import { isInTeam } from '@/middlewares/auth';

const router = express.Router();

router.get('/:id', isInTeam, Controller.get);
router.put('/update/:id', isInTeam, Controller.update); // team id

export default router;
