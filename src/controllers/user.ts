import { Request, Response, NextFunction } from 'express';

import * as UserService from '@/services/auth/user';

// eslint-disable-next-line import/prefer-default-export
export async function get(req: Request<{ id: string }>, res: Response, next: NextFunction) {
  try {
    const result = await UserService.get(req.params.id);
    if (result.data) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (err) {
    next(err);
  }
}
