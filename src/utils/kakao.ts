import axios, { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { tokenResponse } from 'src/types/kakao';

// **TODO** merge 후 dotenv로 refactoring + 서버 IP 설정 후 REDIRECT URI 변경
const API_KEY = 'ec490ce136e6c73e9d307f7797d03926';
const REDIRECT_URI = 'http://localhost:8080/auth/kakao/redirect';

// eslint-disable-next-line import/prefer-default-export
export const getKakaoToken = async (code: string) => {
  try {
    const url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`;
    const header: AxiosRequestHeaders = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };
    const response: AxiosResponse<tokenResponse> = await axios.post(
      url,
      null,
      header,
    );
    return response.data.access_token;
  } catch (err) {
    console.log(err);
    return null;
  }
};
