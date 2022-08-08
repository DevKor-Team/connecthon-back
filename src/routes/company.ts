import express from 'express';
import * as Controller from '@/controllers/company';
import {
  isAdmin,
} from '@/middlewares/auth';

const router = express.Router();

router.post('/', isAdmin, Controller.create);
router.get('/:id', Controller.get);

export default router;
