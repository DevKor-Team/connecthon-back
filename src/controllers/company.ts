import { Request, Response, NextFunction } from 'express';
import * as CompanyService from '@/services/auth/company';
import { CompanySignup, Profile } from '@/interfaces/auth';
import HttpError from '@/interfaces/error';
import { ObjectId } from 'bson';

export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await CompanyService.get(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await CompanyService.getList();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request<Record<string, never>, Record<string, never>, { data: CompanySignup }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await CompanyService.create({
      name: req.body.data.name,
      username: req.body.data.username,
      password: req.body.data.password,
      level: req.body.data.level,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(
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
    const result = await CompanyService.update(req.params.id, req.body, res.locals.isAdmin);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
