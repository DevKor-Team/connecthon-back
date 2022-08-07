/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-underscore-dangle */
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';

import * as CompanyService from '@/services/auth/company';
import * as AuthService from '@/services/auth/auth';
import * as UserService from '@/services/auth/user';
import {
  GeneralUser, User, UserProvider, isCompany,
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
  async (username, password, done) => {
    try {
      console.log(username);
      console.log(password);
      const result = await AuthService.authenticateCompany(username, password);
      console.log(result);
      if (result.data) { return done(null, result.data); }
      return done(null);
    } catch (err) {
      return done(err);
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
      if (result.data) { return done(null, result.data); }

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
      return done(null, registerResult.data);
    }
    throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const kakaoStrategy = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID!,
  callbackURL: '/auth/kakao/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { email } = profile._json.kakao_account as oauthResponse;
    if (email) {
      const result = await UserService.getByEmail(email, UserProvider.Kakao);
      if (result.data) { return done(null, result.data); }

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
      return done(null, registerResult.data);
    }
    throw Error('email not found from oauth');
  } catch (err) {
    return done(err);
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
      if (result.data) return done(null, result.data);

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
      return done(null, registerResult.data);
    }
    throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const serialize = (user: any, done: any) => {
  if (isCompany(user)) {
    done(null, { type: 'company', userData: user });
  } else {
    done(null, { type: 'user', userData: user });
  }
};

export const deserialize = (user: GeneralUser, done: any) => {
  if (isCompany(user.userData)) {
    CompanyService.getByName(user.userData.name)
      .then((result) => {
        if (result.data) { done(null, result.data); } else done(null);
      })
      .catch((err) => { console.log(err); });
  } else {
    UserService.getByEmail(user.userData.email, user.userData.provider)
      .then((result) => {
        if (result.data) { done(null, result.data); } else done(null);
      })
      .catch((err) => { console.log(err); });
  }
};
