import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as KakaoStrategy } from 'passport-kakao';
import { Strategy as GithubStrategy } from 'passport-github';
import { Strategy as LocalStrategy } from 'passport-local';

export const localStrategy = new LocalStrategy(
  { usernameField: 'usename', passwordField: 'password' },
  async (usename, pasword, done) => {
    try {
      // authenticate
    } catch (err) {
      return done(drr);
    }
  },
);

// eslint-disable-next-line max-len
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
export const googleStrategy = new GoogleStrategy({
  clientID: '447101655955-5uivghal57oejdnt0cfr4iqefp06ar03.apps.googleusercontent.com',
  clientSecret: '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',
  callbackURL: '/auth/google/redirect',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    // authenticate or sign up
  } catch (err) {
    return done(err);
  }
});

export const kakaoStrategy = new KakaoStrategy({
  clientID: 'ec490ce136e6c73e9d307f7797d03926',
  callbackURL: '/auth/kakao/redirect',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    // authenticate or sign up
  } catch (err) {
    return done(err);
  }
});

export const githubStrategy = new GithubStrategy({
  clientID: '89fd2e7166f4fe1073be',
  callbackURL: '/auth/github/redirect',
  clientSecret: '44b4c15b01633df6719e1158d37e1b46595e38fc',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log(accessToken);
    console.log(refreshToken);
    console.log(profile);
    // authenticate or sign up
  } catch (err) {
    return done(err);
  }
});

export const serialize = (user: any, done: any) => {
  done(null, user);
};

export const deserialize = (user: any, done: any) => {

};
