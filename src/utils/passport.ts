/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
import { Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';

import * as CompanyService from '@/services/auth/company';
import * as AuthService from '@/services/auth/auth';
import * as UserService from '@/services/auth/user';
import {
  User, UserProvider, UserModel as UserModelType,
} from '@/interfaces/auth';

dotenv.config();

interface oauthResponse {
  email: string;
}

interface githubOauthResponse extends oauthResponse {
  name: string;
}

export const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done: VerifyCallback) => {
    try {
      console.log(username);
      console.log(password);
      const result = await AuthService.authenticateCompany(username, password);
      console.log('authenticateCompany', result);
      if (result.data) {
        return done(
          null,
          {
            type: 'company',
            userData: result.data,
          },
        );
      }
      return done(null);
    } catch (err) {
      return done(err as Error);
    }
  },
);

export const googleStrategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { email } = profile._json;
    if (email) {
      const result = await UserService.getByEmail(email, UserProvider.Google);
      if (result.data) {
        return done(
          null,
          {
            type: 'user',
            userData: result.data,
          },
        );
      }

      const newUser: User = {
        email,
        name: {
          first: profile.name!.givenName,
          last: profile.name!.familyName,
        },
        // **TODO**
        // team:
        // profile:
        isAdmin: false,
        provider: UserProvider.Google,
      };
      const registerResult = await UserService.create(newUser);
      if (registerResult.data) {
        return done(
          null,
          {
            type: 'user',
            userData: registerResult.data,
          },
        );
      }
    }
    throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const kakaoStrategy = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID!,
  callbackURL: '/auth/kakao/redirect',
}, async (accessToken, refreshToken, profile, done: VerifyCallback) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const { email } = profile._json.kakao_account as oauthResponse;
    if (email) {
      const result = await UserService.getByEmail(email, UserProvider.Kakao);
      if (result.data) {
        return done(
          null,
          {
            type: 'user',
            userData: result.data,
          },
        );
      }

      const newUser: User = {
        email,
        name: {
          first: profile.username!.substring(1),
          last: profile.username!.substring(0, 1),
        },
        // **TODO**
        // team:
        // profile:
        isAdmin: false,
        provider: UserProvider.Kakao,
      };
      const registerResult = await UserService.create(newUser);
      if (registerResult.data) {
        return done(
          null,
          {
            type: 'user',
            userData: registerResult.data,
          },
        );
      }
    }
    throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const githubStrategy = new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: '/auth/github/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const profileJson = profile._json as githubOauthResponse;
    if (profileJson) {
      const result = await UserService.getByEmail(profileJson.email, UserProvider.Github);
      if (result.data) {
        return done(
          null,
          {
            type: 'user',
            userData: result.data,
          },
        );
      }

      const newUser: User = {
        email: profileJson.email,
        name: {
          first: profileJson.name.split(' ')[0],
          last: profileJson.name.split(' ')[1],
        },
        // **TODO**
        // team:
        // profile:
        isAdmin: false,
        provider: UserProvider.Github,
      };
      const registerResult = await UserService.create(newUser);
      if (registerResult.data) {
        return done(
          null,
          {
            type: 'user',
            userData: registerResult.data,
          },
        );
      }
    }
    throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const serialize = (
  user: Express.User,
  done: (err: any, user?: false | Express.User | null | undefined) => void,
) => {
  done(null, user);
};

export const deserialize = (
  user: Express.User,
  done: (err: any, user?: false | Express.User | null | undefined) => void,
) => {
  if (user.type === 'company') {
    CompanyService.get(user.userData.id)
      .then((result) => {
        if (result.data) {
          done(
            null,
            {
              type: 'company',
              userData: result.data,
            },
          );
        } else done(null);
      })
      .catch((err) => { console.log(err); });
  } else if (user.type === 'user') {
    UserService.getByEmail(
      (user.userData as UserModelType).email,
      (user.userData as UserModelType).provider,
    )
      .then((result) => {
        if (result.data) {
          done(
            null,
            {
              type: 'user',
              userData: result.data,
            },
          );
        } else done(null);
      })
      .catch((err) => { console.log(err); });
  }
};
