import { UserModel as UserType, CompanyModel as CompanyType } from '@/interfaces/auth';
import { Request } from 'express';

declare global {
    namespace Express {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface AuthInfo {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface User extends UserType, CompanyType {}
//   type User = UserType | CompanyType

  interface Request {
      authInfo?: AuthInfo | undefined;
      user?: User | undefined;

      // These declarations are merged into express's Request type
      login(user: User, done: (err: any) => void): void;
      login(user: User, options: any, done: (err: any) => void): void;
      logIn(user: User, done: (err: any) => void): void;
      logIn(user: User, options: any, done: (err: any) => void): void;

      logout(options: { keepSessionInfo?: boolean }, done: (err: any) => void): void;
      logout(done: (err: any) => void): void;
      logOut(options: { keepSessionInfo?: boolean }, done: (err: any) => void): void;
      logOut(done: (err: any) => void): void;

      // eslint-disable-next-line no-use-before-define
      isAuthenticated(): this is AuthenticatedRequest;
      // eslint-disable-next-line no-use-before-define
      isUnauthenticated(): this is UnauthenticatedRequest;
  }

  interface AuthenticatedRequest extends Request {
      user: User;
  }

  interface UnauthenticatedRequest extends Request {
      user?: undefined;
  }
  }
}
