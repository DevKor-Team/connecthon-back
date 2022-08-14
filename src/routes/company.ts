import express from 'express';
import * as Controller from '@/controllers/company';
import {
  isAdmin, checkAdmin,
} from '@/middlewares/auth';

const router = express.Router();

router.post('/', isAdmin, Controller.create);
router.get('/:id', Controller.get);
router.put('/:id', checkAdmin, Controller.update);

export default router;
