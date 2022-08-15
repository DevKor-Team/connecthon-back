import { CustomError } from 'ts-custom-error';

class HttpError extends CustomError {
  public constructor(
        public status: number,
        message: string,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super(message);
  }
}

export default HttpError;
