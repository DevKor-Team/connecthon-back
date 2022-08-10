import { Request, Response, NextFunction } from 'express';
import * as TeamService from '@/services/team';
import * as UserService from '@/services/auth/user';
import * as CompanyService from '@/services/auth/company';

interface MulterImage extends Express.Multer.File {
  location?: string;
}

export const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image: MulterImage = req.file!;
    if (image.location) {
      res.json({ url: image.location });
    } else {
      throw Error('no image');
    }
  } catch (err) {
    next(err);
  }
};

export const uploadProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const image: MulterImage = req.file!;
    if (image.location && req.user) {
      if (req.user.type === 'user') {
        const result = await UserService
          .update(req.user.userData.id, { profile: { img: image.location } });
        res.json(result);
      } else if (req.user.type === 'company') {
        const result = await CompanyService
          .update(req.user.userData.id, { profile: { img: image.location } });
        res.json(result);
      } else {
        throw Error('unauthenticated user');
      }
    } else {
      throw Error('no image');
    }
  } catch (err) {
    next(err);
  }
};
export const uploadTeam = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const image: MulterImage = req.file!;
    if (image.location) {
      const result = await TeamService.update(req.params.id, { image: image.location });
      res.json(result);
    } else {
      throw Error('no image');
    }
  } catch (err) {
    next(err);
  }
};
