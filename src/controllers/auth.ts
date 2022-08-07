/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import * as CONSTS from '@/utils/consts';
import { isCompany, UserModel } from '@/interfaces/auth';

export const logout = (req: Request, res: Response) => {
  try {
    req.logout((err) => {
      if (err) { return console.log(err); }
      res.redirect('/');
    });
  } catch (err) {
    console.log(err);
  }
};
export const localLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({ reason: 'ALREADY LOGIN' });
    } else {
      next();
    }
  },
  passport.authenticate('local', { successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT }),
];

export const googleLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({ reason: 'ALREADY LOGIN' });
    } else {
      next();
    }
  },
  passport.authenticate('google', {
    successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT, scope: ['profile', 'email'],
  }),
  (req: Request, res: Response) => {
    res.json({ success: true });
  },
];

export const kakaoLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({ reason: 'ALREADY LOGIN' });
    } else {
      next();
    }
  },
  passport.authenticate('kakao', {
    successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT, scope: ['profile_nickname', 'account_email'],
  }),
];

export const githubLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.status(403).json({ reason: 'ALREADY LOGIN' });
    } else {
      next();
    }
  },
  passport.authenticate('github', {
    successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT, scope: ['profile', 'email'],
  }),
  (req: Request, res: Response) => {
    res.json({ success: true });
  },
];

export const getSessionUser = (req: Request, res: Response) => {
  if (req.user) {
    res.send({
      type: req.user?.type,
      ...req.user?.userData,
    });
  }
};
