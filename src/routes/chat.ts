import express from 'express';
import * as Controller from '@/controllers/chat';
import {
  isCompany,
} from '@/middlewares/auth';

const router = express.Router();

router.post('/create', isCompany, Controller.openNew);
router.get('/:id', Controller.get); // chat room id
router.get('/', Controller.getList); // user id
router.post('/send', Controller.send);

export default router;
