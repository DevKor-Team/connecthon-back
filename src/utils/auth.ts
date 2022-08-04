import { NextFunction, Request, Response } from 'express';

import { GeneralUser, isCompany } from '@/interfaces/auth';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const curUser = req.user as GeneralUser;
  if (!req.isAuthenticated() || isCompany(curUser.userData) || !curUser.userData.isAdmin) {
    res.status(401).json({ reason: 'NOT ADMIN' });
  } else {
    next();
  }
};

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    next();
  } else {
    res.status(401).json({ reasone: 'NOT AUTHENTICATED' });
  }
};
