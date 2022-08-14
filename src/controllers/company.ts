import { Request, Response, NextFunction } from 'express';
import * as CompanyService from '@/services/auth/company';
import { CompanySignup, Profile } from '@/interfaces/auth';

export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await CompanyService.get(req.params.id);
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
      name: req.body.data.username,
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
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await CompanyService.update(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
