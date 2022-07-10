import express from 'express';
import userRouter from '@/routes/user';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello world');
});
router.use('/users', userRouter);

export default router;
