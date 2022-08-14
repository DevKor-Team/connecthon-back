/* eslint-disable @typescript-eslint/restrict-template-expressions */
import winston from 'winston';
import 'winston-daily-rotate-file';
import SlackHook from 'winston-slack-webhook-transport';
import fs from 'fs';

function loggerLoader() {
  fs.mkdir('./logs', () => { /* no-op */ });

  const transportAll = new winston.transports.DailyRotateFile({
    filename: 'logs/application-%DATE%.log',
    datePattern: 'MM-DD-HH',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '2d',
  });

  const transportError = new winston.transports.DailyRotateFile({
    level: 'error',
    filename: 'logs/application-error-%DATE%.log',
    datePattern: 'MM-DD-HH',
    zippedArchive: false,
    maxSize: '20m',
    maxFiles: '2d',
  });

  const logger = winston.createLogger({
    level: 'info',
    transports: [
      transportAll, // will be used on info level
      transportError, // will be used on error level
    ],
  });
  winston.clear().add(logger);

  if (process.env.SLACK_WEB_HOOK && process.env.NODE_ENV === 'production') {
    const timeStampFormatter = winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss ZZ',
    });
    const transportSlack = new SlackHook({
      webhookUrl: process.env.SLACK_WEB_HOOK,
      level: 'error',
      formatter: (rawInfo) => {
        const info = timeStampFormatter.transform(rawInfo) as SlackHook.TransformableInfo;
        let message = '';
        if (info.error && info.error instanceof Error) {
          if (info.error.stack) {
            message = `${info.timestamp} ${info.level}: ${info.message} :\n${info.error.stack}`;
          } else {
            message = `${info.timestamp} ${info.level}: ${info.message} : ${info.error.toString()}`;
          }
        } else {
          message = `${info.timestamp} ${info.level}: ${info.message}`;
        }
        return {
          text: message,
        };
      },
    });
    logger.add(transportSlack);

    winston.info('slack hook added');
  } else {
    winston.error('slack web hook url not found');
  }

  winston.info('Info log start');
  winston.error('Error log started');
}

export default loggerLoader;
