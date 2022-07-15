import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

export const signup = async (req: Request, res: Response) => {
  try {
    if (req.isAuthenticated()) {
      res.sendStatus(403);
      return;
    }
    // TODO
    const result = undefined;
    res.json(result);
  } catch (err) {
    console.log(err);
  }
};

export const localLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      next();
    }
  },
  passport.authenticate('local', { failureRedirect: '/login' }),
];

export const googleLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      next();
    }
  },
  passport.authenticate('google', {
    successRedirect: '/', failureRedirect: '/login', scope: ['profile', 'email'],
  }),
  (req: Request, res: Response) => {
    res.json({ success: true });
  },
];

export const kakaoLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      next();
    }
  },
  passport.authenticate('kakao', {
    successRedirect: '/', failureRedirect: '/login', scope: ['profile_nickname', 'account_email'],
  }),
  (req: Request, res: Response) => {
    res.json({ success: true });
  },
];

export const githubLogin = [
  (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      res.sendStatus(403);
    } else {
      next();
    }
  },
  passport.authenticate('github', {
    successRedirect: '/', failureRedirect: '/login', scope: ['profile', 'email'],
  }),
  (req: Request, res: Response) => {
    res.json({ success: true });
  },
];
