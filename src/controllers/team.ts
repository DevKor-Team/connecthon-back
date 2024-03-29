import { Request, Response, NextFunction } from 'express';
import * as TeamService from '@/services/team';
import { Team as TeamType } from '@/interfaces/team';

export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await TeamService.get(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getList(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await TeamService.getList();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request<Record<string, never>, Record<string, never>, { data: TeamType }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await TeamService.create({
      name: req.body.data.name,
      description: req.body.data.description,
      image: req.body.data.image,
      users: [],
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request<{ id: string }, Record<string, never>, { data: TeamType }>,
  res: Response<any, { isAdmin: boolean }>,
  next: NextFunction,
) {
  try {
    const result = await TeamService.update(
      req.params.id,
      {
        name: req.body.data.name,
        description: req.body.data.description,
        image: req.body.data.image,
      },
      res.locals.isAdmin,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    if (req.isAuthenticated()) {
      const result = await TeamService.addUser(
        req.params.id,
        req.user.userData.id,
      ); // todo - user id type
      res.json(result);
    } else {
      throw new Error('Unauthenticated User');
    }
  } catch (err) {
    next(err);
  }
}

export async function deleteTeam(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await TeamService.deleteObj(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
