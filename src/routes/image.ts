import express from 'express';
import * as Controller from '@/controllers/image';
import {
  isParticipant,
  isInTeam,
} from '@/middlewares/auth';
import upload from '@/utils/s3';

const router = express.Router();

router.post('/team/:id', isInTeam, upload.single('image'), Controller.uploadTeam);
router.post('/profile', upload.single('image'), Controller.uploadProfile);
router.post('/', isParticipant, upload.single('image'), Controller.uploadImage);

export default router;
