/* eslint-disable prefer-destructuring */
/* eslint-disable consistent-return */
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
    const result = await UserService.getByOauthId(profile.id);
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
      name: { first: undefined, last: undefined },
      oauthid: profile.id,
      isAdmin: false,
      provider: UserProvider.Google,
    };
    if (profile._json.email) {
      newUser.email = profile._json.email;
    }
    if (profile.name) {
      if (profile.name.familyName) {
        newUser.name.first = profile.name.familyName;
      }
      if (profile.name.givenName && newUser.name.first) {
        newUser.name.first = newUser.name.first.concat(profile.name.givenName);
      } else if (profile.name.givenName) {
        newUser.name.first = profile.name.givenName;
      }
    } else if (profile.displayName) {
      newUser.name.first = profile.displayName;
    }
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
    const result = await UserService.getByOauthId(profile.id);
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
      name: {
      },
      isAdmin: false,
      provider: UserProvider.Kakao,
      oauthid: profile.id,
    };

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const json = profile._json.kakao_account as oauthResponse;
    if (json.email) {
      newUser.email = json.email;
    }
    if (profile.username) {
      newUser.name.first = profile.username;
    }
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
    const result = await UserService.getByOauthId(profile.id);
    if (result.data) {
      return done(
        null,
        {
          type: 'user',
          userData: result.data,
        },
      );
    }
    const json = profile._json as githubOauthResponse;
    const newUser: User = {
      name: {
      },
      oauthid: profile.id,

      isAdmin: false,
      provider: UserProvider.Github,
    };
    if (json.email) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      newUser.email = json.email;
    }
    if (json.name) {
      newUser.name.first = json.name;
    }
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
    UserService.get(user.userData.id)
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
