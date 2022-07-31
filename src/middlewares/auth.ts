import { NextFunction, Request, Response } from 'express';
import UserModel from '@/models/user';
import CompanyModel from '@/models/company';
import { ObjectID } from 'bson';
import { ADMIN_LEVEL } from '@/utils/consts';

export function isInTeam(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (res.locals.isAdmin) {
    next();
  } else if (req.user instanceof UserModel) {
    if (req.user.team == null || ObjectID.isValid(req.user.team)) {
      throw new Error('User dont have team');
    } else if (req.user.team.toString() !== req.params.id) {
      throw new Error('Current user is not in team');
    } else {
      next();
    }
  } else if (req.user instanceof CompanyModel) {
    throw new Error('Company user dont have team');
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (req.user instanceof UserModel) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
      next();
    }
  } else if (req.user instanceof CompanyModel) {
    if (req.user.level === ADMIN_LEVEL) {
      res.locals.isAdmin = true;
      next();
    }
  }
  throw new Error('Not admin');
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (res.locals.isAdmin) {
    next();
  } else if (req.user instanceof UserModel) {
    if (req.user.isAdmin) {
      res.locals.isAdmin = true;
    }
  } else if (req.user instanceof CompanyModel) {
    if (req.user.level === ADMIN_LEVEL) {
      res.locals.isAdmin = true;
    }
  }
  next();
}

export function isParticipant(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (req.user instanceof UserModel) {
    next();
  } else if (req.user instanceof CompanyModel) {
    throw new Error('Current user is company');
  }
}
