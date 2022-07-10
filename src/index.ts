import express from 'express';
import helmet from 'helmet';
import http from 'http';
import cookieParser from 'cookie-parser';
import router from '@/routes';
import session from 'express-session';
import passport from 'passport';
import * as Passport from './utils/passport';

// setup
// async function initialize() {
// connect mongodb
// connect logging module
// }

// create app of express
function expressLoader() {
  const app = express();
  app.use(helmet());

  // parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(router);
  // app.use(errorHandler); // todo - error handler

  app.use(session({
    secret: 'keyboard cat', // 임시 secret key
    resave: true,
    saveUninitialized: true,
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(Passport.localStrategy);
  passport.use(Passport.githubStrategy);
  passport.use(Passport.kakaoStrategy);
  passport.use(Passport.googleStrategy);
  passport.serializeUser(Passport.serialize);
  passport.deserializeUser(Passport.deserialize);
  app.use((req, res, next) => {
    if (!req.session.passport || JSON.stringify(req.session.passport) === '{}') {
      req.user = undefined;
    }
    res.setHeader('Set-Cookie', 'key=value; HttpOnly; SameSite=strict');
    next();
  });

  app.all('*', (_, res) => {
    res.status(404).json({ success: false });
  });

  return app;
}

function createServer() {
  const app = expressLoader();
  const httpServer = http.createServer(app);
  // maybe, we're attatching socket io server here
  // const io = new socketio.Server(server);

  // todo - different dev and prod settings
  const port = 8080;
  httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`); // todo - change console.log to logger
  });
}

createServer();
