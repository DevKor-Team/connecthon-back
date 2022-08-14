import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import HttpError from '@/interfaces/error';

// eslint-disable-next-line import/prefer-default-export
export function errorHandler(err: HttpError, _: Request, res: Response, __: NextFunction) {
  const status = err.status ?? 500;
  if (status === 500) {
    winston.error(err.stack || '');
  }
  res.status(status).json({
    data: null,
    error: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      message: err.message,
      status,
    },
  });
}
