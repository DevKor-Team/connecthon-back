/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import * as CONSTS from '@/utils/consts';

export const logout = (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json('NOT LOGGED IN');
    }
    req.logout((err) => {
      if (err) { return console.log(err); }
      res.redirect(CONSTS.LOGIN_SUCCESS_REDIRECT);
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

export const getSessionUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json('NOT LOGGED IN');
      next();
    }
    if (req.user) {
      res.json({
        type: req.user.type,
        ...req.user.userData,
      });
      next();
    } else {
      res.status(401).json('NOT LOGGED IN');
      next();
    }
  } catch (err) {
    next(err);
  }
};
