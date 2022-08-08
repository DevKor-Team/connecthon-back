import { Request, Response, NextFunction } from 'express';
import * as ProjectService from '@/services/project';
import * as TempService from '@/services/temp';
import { Project, ProjectTemp } from '@/interfaces/project';
import { ObjectId } from 'bson';

export const getList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await ProjectService.getList();
    res.json(list);
  } catch (err) {
    res.status(400).json({ reason: 'not found' });
    next(err);
  }
};

export const get = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const result = await ProjectService.get(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ reason: 'not found' });
    next(err);
  }
};

export const create = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProjectService.create(req.params.id);

    const temp = await TempService.get(req.params.id);
    if (temp.data) {
      await TempService.deleteObj(req.params.id);
    }
    await TempService.create(req.params.id);

    res.json(result);
  } catch (err) {
    res.status(400).json({ reason: 'project already exists' });
    next(err);
  }
};

export const update = async (
  req: Request<{ id: string },
    Record<string, never>,
    { change: Partial<Project> }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProjectService.update(req.params.id, req.body.change);
    const temp = await TempService.get(req.params.id);
    if (temp.data === undefined) {
      await TempService.create(req.params.id);
    }
    const change: Partial<ProjectTemp> = {};
    if (result.data?.stack) {
      change.stack = result.data.stack;
    }
    if (result.data?.content) {
      change.content = result.data.content;
    }
    await TempService.update(
      req.params.id,
      change,
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ reason: 'err' });
    next(err);
  }
};

export const remove = async (
  req: Request<{ project: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProjectService.deleteObj(req.params.project);
    res.json(result);
  } catch (err) {
    res.status(400).json({ reason: 'err' });
    next(err);
  }
};

export const like = async (
  req: Request<Record<string, never>,
    Record<string, never>,
    { user: ObjectId, team: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const change = { likes: [req.body.user] };
    const result = await ProjectService.update(req.body.team, change);
    res.json(result);
  } catch (err) {
    res.status(400).json({ reason: 'err' });
    next(err);
  }
};

export const alreadyLikes = async (
  req: Request<{ team: string, user: ObjectId }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ProjectService.get(req.params.team);
    if (result.data?.likes.includes(req.params.user)) {
      res.json({ like: true });
    } else {
      res.json({ like: false });
    }
  } catch (err) {
    res.status(400).json({ reason: 'not found' });
    next(err);
  }
};
