/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import * as CONSTS from '@/utils/consts';
import winston from 'winston';
import HttpError from '@/interfaces/error';

export const logout = (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    throw new HttpError(401, 'Not Logged In');
  }
  req.logout((err) => {
    if (err) { return winston.error(err); }
    res.redirect(CONSTS.LOGIN_SUCCESS_REDIRECT);
  });
};
export const localLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      throw new HttpError(403, 'Already Logined');
    } else {
      next();
    }
  },
  passport.authenticate('local', { successRedirect: CONSTS.LOGIN_SUCCESS_REDIRECT, failureRedirect: CONSTS.LOGIN_FAILURE_REDIRECT }),
];

export const googleLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      throw new HttpError(403, 'Already Logined');
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
      throw new HttpError(403, 'Already Logined');
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
      throw new HttpError(403, 'Already Logined');
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
      throw new HttpError(401, 'Not Logged In');
    } else {
      res.json({
        type: req.user?.type,
        ...req.user?.userData,
      });
    }
  } catch (err) {
    next(err);
  }
};
