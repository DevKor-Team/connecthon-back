import express from 'express';
import helmet from 'helmet';
import http from 'http';
import cookieParser from 'cookie-parser';
import router from '@/routes';
import mongoose, { ConnectOptions } from 'mongoose';

// setup
async function initialize() {
  // connect mongodb
  const mongoHost = 'mongodb+srv://testboy:5OFo50EvkA9Mn43X@cluster0.haecp.mongodb.net/?retryWrites=true&w=majority';

  await mongoose.connect(mongoHost);
  /*
  useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex
  are no longer supported options. Mongoose 6 always behaves as if
  useNewUrlParser, useUnifiedTopology, and useCreateIndex are true,
  and useFindAndModify is false. Please remove these options from your code.
  */
  console.log('mongoose connected');
  // connect logging module
}

// create app of express
async function expressLoader() {
  await initialize();

  const app = express();
  app.use(helmet());

  // parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(router);
  // app.use(errorHandler); // todo - error handler

  app.all('*', (_, res) => {
    res.status(404).json({ error: { message: 'URL Not Found' } });
  });

  return app;
}

async function createServer() {
  const app = await expressLoader();
  const httpServer = http.createServer(app);
  // maybe, we're attatching socket io server here
  // const io = new socketio.Server(server);

  // todo - different dev and prod settings
  const port = 8080;
  httpServer.listen(port, () => {
    console.log(`server listening on port ${port}`); // todo - change console.log to logger
  });
}

createServer()
  .then(() => {
    console.log('server created');
  })
  .catch((err) => {
    console.dir(err);
  });
