import { Request, Response, NextFunction } from 'express';
import * as ChatService from '@/services/chat';
import * as UserService from '@/services/auth/user';
import * as CompanyService from '@/services/auth/company';
import { Chat } from '@/interfaces/chat';

export const get = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated()) {
      throw Error('unauthenticated user');
    }
    const result = await ChatService.get(req.params.id);
    if (req.user?.type === 'user' && result.data?.user !== req.user.userData.id) {
      throw Error('user is not in room');
    } else if (req.user?.type === 'company' && result.data?.company !== req.user.userData.id) {
      throw Error('company is not in room');
    }
    res.json(result);
  } catch (err) {
    next(err);
  }
};
export const getList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated()) {
      throw Error('unvalid request');
    }
    const result = await ChatService.getList(req.user.userData.id, req.user.type);
    if (result.data === undefined || result.data?.length === 0) {
      res.json({ data: [] });
    } else {
      const roomList = await Promise.all(result.data?.map(async (room) => {
        const user = await UserService.get(room.user);
        const company = await CompanyService.get(room.company);
        return {
          userImg: user.data?.profile?.img,
          companyImg: company.data?.logo,
          userName: user.data?.name,
          companyName: company.data?.name,
          company: room.company,
          user: room.user,
          id: room.id,
          lastMsg: room.lastMsg,
          lastSend: room.lastSend,
        };
      }));

      res.json({ data: roomList });
    }
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

export const send = async (
  req: Request<Record<string, never>,
    Record<string, never>,
    { room: string, msg: string, sender: 'user' | 'company' }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.isAuthenticated()) {
      throw Error('invalid user');
    }
    const room = await ChatService.get(req.body.room);
    if (room === undefined) {
      throw Error('no room');
    }
    const chat: Chat = {
      sender: req.body.sender,
      when: new Date(),
      msg: req.body.msg,
    };
    const result = await ChatService.update(chat, req.body.room);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
