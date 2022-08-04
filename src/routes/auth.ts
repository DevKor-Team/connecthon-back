/* eslint-disable @typescript-eslint/no-unsafe-argument */
import express from 'express';
import passport from 'passport';
import * as AuthController from '@/controllers/auth';
import * as CONSTS from '@/utils/consts';

const router = express.Router();

router.get('/logout', AuthController.logout);
router.get('/user', AuthController.getSessionUser);

/*
router.get('/login', (req, res, next) => {
  res.send(`<h1>Sign in</h1>
<form action="http://localhost:8080/auth/local" method="post">
    <section>
        <label for="username">Username</label>
        <input id="username" name="username" type="text" autocomplete="username" required autofocus>
    </section>
    <section>
        <label for="current-password">Password</label>
        <input id="password" name="password" type="password" autocomplete="current-password" required>
    </section>
    <button type="submit">Sign in</button>
</form>`);
});
*/

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
