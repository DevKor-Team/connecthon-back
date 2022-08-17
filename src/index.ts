/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import router from '@/routes';
import * as Passport from '@/utils/passport';
import fs from 'fs';
import socket from '@/utils/socket';
import loggerLoader from '@/utils/logger';
import winston from 'winston';
import { errorHandler } from '@/middlewares/error';

declare module 'express-session' {
  interface SessionData {
    passport: any;
  }
}
if (process.env.NODE_ENV === 'development') {
  dotenv.config({
    path: '.env',
  });
} else if (process.env.NODE_ENV === 'prouction') {
  if (fs.existsSync('env')) {
    dotenv.config({
      path: '.env',
    });
  } else {
    winston.info('on production mode, set environment variables via other way');
  }
}

// setup
async function initialize() {
  // connect mongodb
  const mongoHost = process.env.MONGO_HOST;
  if (mongoHost) {
    await mongoose.connect(mongoHost);
    winston.info('mongoose connected');
  } else {
    winston.error('mongo host not exists');
  }
}

// create app of express
async function expressLoader() {
  await initialize();

  const app = express();
  app.use(helmet());
  app.use(cors());
  // parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // app.use(errorHandler); // todo - error handler
  app.enable('trust proxy');
  app.use(session({
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 3 * 24 * 60 * 60 * 1000, // 3 day
      domain: '.connecthon.com',
      // sameSite: 'none',
    },
    secret: process.env.SESSION_SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_HOST }),
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(Passport.localStrategy);
  passport.use(Passport.githubStrategy);
  passport.use(Passport.kakaoStrategy);
  passport.use(Passport.googleStrategy);
  passport.serializeUser(Passport.serialize);
  passport.deserializeUser(Passport.deserialize);

  app.use(router);
  app.use(errorHandler);
  // app.all('*', (_, res) => {
  //   res.status(404).json({ data: null, error: { message: 'URL Not Found' } });
  // });

  return app;
}

async function createServer() {
  loggerLoader();
  const app = await expressLoader();
  const httpServer = http.createServer(app);
  // maybe, we're attatching socket io server here
  // const io = new socketio.Server(server);

  // todo - different dev and prod settings
  const port = process.env.PORT || 8080;

  httpServer.listen(port, () => {
    winston.info(`server listening on port ${port}`);
  });
  socket(httpServer);
}

createServer()
  .then(() => {
    winston.info('server created');
  })
  .catch((err) => {
    winston.error(err);
  });
