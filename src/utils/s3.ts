/* eslint-disable @typescript-eslint/unbound-method */
import { S3 } from 'aws-sdk';
import multerS3 from 'multer-s3';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();
const s3 = new S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, new Date().toString());
    },
    acl: 'private',
  }),
  limits: { fieldSize: 25 * 1024 * 1024 },
});

export default upload;
