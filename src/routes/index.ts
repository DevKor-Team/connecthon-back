import express from 'express';
import userRouter from '@/routes/user';
import authRouter from '@/routes/auth';
import teamRouter from '@/routes/team';
import companyRouter from '@/routes/company';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});
router.use('/users', userRouter);
router.use('/teams', teamRouter);
router.use('/auth', authRouter);
router.use('/companies', companyRouter);

export default router;
