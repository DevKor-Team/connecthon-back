import { Request, Response, NextFunction } from 'express';
import * as TempService from '@/services/temp';
import { ProjectTemp } from '@/interfaces/project';

export const get = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const result = await TempService.get(req.params.id);
    res.json(result);
  } catch (err) {
    res.json({ reason: 'not found' });
    next(err);
  }
};

export const update = async (
  req: Request<{ id: string },
    Record<string, never>,
    { change: Partial<ProjectTemp> }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await TempService.update(req.params.id, req.body.change);
    res.json(result);
  } catch (err) {
    res.json({ reason: 'not found' });
    next(err);
  }
};
