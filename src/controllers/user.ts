import { Request, Response, NextFunction } from 'express';
import * as UserService from '@/services/auth/user';
import { Profile } from '@/interfaces/auth';
import HttpError from '@/interfaces/error';
import { ObjectId } from 'bson';

export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await UserService.get(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await UserService.getList();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request<{ id: string }, Record<string, never>, { profile: Profile }>,
  res: Response<any, { isAdmin: boolean }>,
  next: NextFunction,
) {
  try {
    if (!res.locals.isAdmin) {
      const id = new ObjectId(req.user?.userData.id);
      if (!id.equals(req.params.id)) {
        throw new HttpError(400, 'Id is not same with current user');
      }
    }
    const result = await UserService.update(req.params.id, req.body, res.locals.isAdmin);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// update Team
