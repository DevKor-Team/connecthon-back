import { Request, Response, NextFunction } from 'express';
import * as UserService from '@/services/auth/user';
import { Profile } from '@/interfaces/auth';

// eslint-disable-next-line import/prefer-default-export
export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await UserService.get(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request<{ id: string }, Record<string, never>, { profile: Profile }>,
  res: Response,
  next: NextFunction,
) {
  try {
    // todo - file upload and get url
    const result = await UserService.update(req.params.id, req.body, false);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// update Team
