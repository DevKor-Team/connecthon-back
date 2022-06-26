import express from 'express';
import helmet from 'helmet';
import http from 'http';
import cookieParser from 'cookie-parser';
import router from '@/routes';

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
  httpServer.listen(8080, () => {
    console.log('server listening..'); // todo - change console.log to logger
  });
}

createServer();
