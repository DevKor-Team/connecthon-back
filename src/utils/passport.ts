import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';
import dotenv from 'dotenv';

import * as AuthService from '@/services/auth/auth'
import * as UserService from '@/services/auth/user'
import { User, UserProvider } from '@/interfaces/auth';
import UserModel from '@/models/user'
import CompanyModel from '@/models/company';

dotenv.config();

export const localStrategy = new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const result = await AuthService.authenticateCompany(username, password);
      if (result.data)
        return done(null, result.data!);
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
    const email = profile._json.email;
    if (email) {
      const result = await UserService.getByEmail(email, UserProvider.Google);
      if (result.data)
        return done(null, result.data!);
      else {
        const newUser: User = {
          email: email,
          name: {
            first: profile.name!.givenName,
            last: profile.name!.familyName
          },
          // **TODO**
          // team: 
          // profile:
          isAdmin: false,
          provider: UserProvider.Google
        }
        const registerResult = await UserService.create(newUser);
        return done(null, registerResult.data);
      }
    }
    else throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const kakaoStrategy = new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID!,
  callbackURL: '/auth/kakao/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile._json.email;
    if (email) {
      const result = await UserService.getByEmail(email, UserProvider.Kakao);
      if (result.data)
        return done(null, result.data!);
      else {
        const newUser: User = {
          email: email,
          name: {
            first: profile.username!.substring(1),
            last: profile.username!.substring(0, 1)
          },
          // **TODO**
          // team: 
          // profile:
          isAdmin: false,
          provider: UserProvider.Kakao
        }
        const registerResult = await UserService.create(newUser);
        return done(null, registerResult.data);
      }
    }
    else throw Error('email not found from oauth');
  } catch (err) {
    return done(err);
  }
});

type githubOauthResponse = {
  name: string;
  email: string
}

export const githubStrategy = new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID!,
  clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  callbackURL: '/auth/github/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const profileJson = profile._json as githubOauthResponse;
    if (profileJson) {
      const result = await UserService.getByEmail(profileJson.email, UserProvider.Github);
      if (result.data)
        return done(null, result.data!);
      else {
        const newUser: User = {
          email: profileJson.email,
          name: {
            first: profileJson.name.split(' ')[0],
            last: profileJson.name.split(' ')[1]
          },
          // **TODO**
          // team: 
          // profile:
          isAdmin: false,
          provider: UserProvider.Github
        }
        const registerResult = await UserService.create(newUser);
        return done(null, registerResult.data);
      }
    }
    else throw Error('email not found from oauth');
  } catch (err) {
    return done(err as Error);
  }
});

export const serialize = (user: any, done: any) => {
  done(null, user);
};

export const deserialize = (user: any, done: any) => {
  if (user instanceof UserModel) {
    UserService.getByEmail(user.email, user.provider).then(result => {
      if (result.data)
        done(null, result.data!);
      else done(null)
    })
  } else if (user instanceof CompanyModel) {
    CompanyModel.findOne({ username: user.username }).then(result => {
      if (result)
        done(null, result);
      else done(null)
    })
  }
};
