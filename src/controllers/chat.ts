import { Request, Response, NextFunction } from 'express';
import * as ChatService from '@/services/chat';
import { userType } from '@/interfaces/auth';

export const get = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (req.isAuthenticated()) {
      throw Error('unvalid request');
    }
    const result = await ChatService.get(req.params.id);
    if (req.user?.type === 'user' && result.data?.user !== req.user.userData.id) {
      throw Error('unvalid request');
    } else if (req.user?.type === 'company' && result.data?.company !== req.user.userData.id) {
      throw Error('unvalid request');
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};
export const getList = async (
  req: Request<{ id: string, sender: userType }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ChatService.getList(req.params.id, req.params.sender);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const openNew = async (
  req: Request<Record<string, never>,
    Record<string, never>,
    { user: string, company: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await ChatService.create(req.body.user, req.body.company);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
