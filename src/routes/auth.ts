/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import passport from 'passport';
import * as AuthController from '@/controllers/auth';
import * as CONSTS from '@/utils/consts';
import { isAuth } from '@/utils/auth';

const router = express.Router();

router.get('/logout', isAuth, AuthController.logout);
router.get('/user', isAuth, AuthController.getSessionUser);
router.post('/local', AuthController.localLogin);
router.get('/google', AuthController.googleLogin);
router.get('/kakao', AuthController.kakaoLogin);
router.get('/github', AuthController.githubLogin);
router.get('/kakao/redirect', passport.authenticate('kakao', {
  successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT, scope: ['profile_nickname', 'account_email'],
}));
router.get('/google/redirect', passport.authenticate('google', {
  successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT, scope: ['profile', 'email'],
}));
router.get('/github/redirect', passport.authenticate('github', {
  successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT, scope: ['profile', 'email'],
}));

export default router;
