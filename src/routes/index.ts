import express from 'express';
import userRouter from '@/routes/user';
import authRouter from '@/routes/auth';
import teamRouter from '@/routes/team';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});
router.use('/users', userRouter);
router.use('/teams', teamRouter);
router.use('/auth', authRouter);

export default router;
