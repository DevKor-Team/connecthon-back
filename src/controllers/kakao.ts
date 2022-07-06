import { getKakaoToken } from '@/utils/kakao';
import { Request, Response } from 'express';

export const redirectLoginReqest = async (req: Request, res: Response) => {
  const API_KEY = 'ec490ce136e6c73e9d307f7797d03926';
  const REDIRECT_URI = 'http://localhost:8080/auth/kakao/redirect';

  const url = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
  res.redirect(url);
};

export const loginCallback = async (req: Request, res: Response) => {
  if (req.query.code) {
    const code = req.query.code.toString();
    const token = await getKakaoToken(code);
    console.log(token);
  }
};
