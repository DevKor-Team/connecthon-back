/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import passport from 'passport';
import * as AuthController from '../controllers/auth';

const router = express.Router();

router.post('/signup', AuthController.signup);

router.post('/local', AuthController.localLogin);
router.get('/google', AuthController.googleLogin);
router.get('/kakao', AuthController.kakaoLogin);
router.get('/github', AuthController.githubLogin);

router.get('/kakao/redirect', passport.authenticate('kakao', {
  successRedirect: '/', failureRedirect: '/login', scope: ['profile', 'email'],
}));

router.get('/google/redirect', passport.authenticate('google', {
  successRedirect: '/', failureRedirect: '/login', scope: ['profile', 'email'],
}));

router.get('/github/redirect', passport.authenticate('github', {
  successRedirect: '/', failureRedirect: '/login', scope: ['profile', 'email'],
}));

export default router;
