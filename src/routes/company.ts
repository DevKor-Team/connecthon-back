import express from 'express';
import * as Controller from '@/controllers/company';
import {
  isAdmin, checkAdmin,
} from '@/middlewares/auth';

const router = express.Router();

router.get('/', Controller.getList);
router.post('/', isAdmin, Controller.create);
router.get('/:id', Controller.get);
router.put('/:id/profile', checkAdmin, Controller.update);

export default router;
