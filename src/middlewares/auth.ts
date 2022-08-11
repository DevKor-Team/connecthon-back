import { NextFunction, Request, Response } from 'express';
import { ObjectID } from 'bson';
import { ADMIN_LEVEL } from '@/utils/consts';
import { CompanyModel, UserModel } from '@/interfaces/auth';

export function isInTeam(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (res.locals.isAdmin) {
    next();
  } else if (req.user.type === 'user') {
    const teamId = (req.user.userData as UserModel).team;
    if (teamId == null || ObjectID.isValid(teamId)) {
      throw new Error('User dont have team');
    } else if (teamId.toString() !== req.params.id) {
      throw new Error('Current user is not in team');
    } else {
      next();
    }
  } else if (req.user.type === 'company') {
    throw new Error('Company user dont have team');
  } else {
    throw new Error('Unknown user type');
  }
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (req.user.type === 'user') {
    if ((req.user.userData as UserModel).isAdmin) {
      res.locals.isAdmin = true;
      next();
    } else {
      throw new Error('User is not admin');
    }
  } else if (req.user.type === 'company') {
    if ((req.user.userData as CompanyModel).level === ADMIN_LEVEL) {
      res.locals.isAdmin = true;
      next();
    } else {
      throw new Error('Compnay is not admin');
    }
  } else {
    throw new Error('Unknown user type');
  }
}

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (req.user.type === 'user') {
    if ((req.user.userData as UserModel).isAdmin) {
      res.locals.isAdmin = true;
    }
  } else if (req.user.type === 'company') {
    if ((req.user.userData as CompanyModel).level === ADMIN_LEVEL) {
      res.locals.isAdmin = true;
    }
  } else {
    throw new Error('Unknown user type');
  }
  next();
}

export function isParticipant(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (req.user.type === 'user') {
    next();
  } else if (req.user.type === 'company') {
    throw new Error('Current user is company');
  }
}

export function isCompany(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated()) {
    throw new Error('Unauthenticated User');
  } else if (req.user.type === 'user') {
    throw new Error('Current user is not company');
  } else if (req.user.type === 'company') {
    next();
  }
}
