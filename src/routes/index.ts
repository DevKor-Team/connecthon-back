import express from 'express';
import userRouter from '@/routes/user';
import authRouter from './auth';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});
router.use('/users', userRouter);
router.use('/auth', authRouter);

export default router;
