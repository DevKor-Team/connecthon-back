import { ObjectID } from 'bson';

export interface Profile {
  img?: string;
  link?: {
    github?: string;
    blog?: string;
    instagram?: string;
  };
  position?: string;
  career?: string[];
  major?: string;
  university?: string;
  introduction?: string;
}

export enum UserProvider {
  Google = 'GOOGLE',
  Github = 'GITHUB',
  Kakao = 'KAKAO',
}

export interface User {
  email?: string;
  name: {
    first?: string;
    last?: string;
  };
  team?: ObjectID;
  profile?: Profile;
  isAdmin: boolean;
  provider: UserProvider;
  oauthid: string;
}

// fields can be shown
export interface Company {
  name: string;
  profile?: Profile;
  level: number;
}

// fields that not be shown
export interface CompanySignup extends Company {
  username: string;
  password: string;
}

export interface UserModel extends User {
  id: ObjectID;
}

export interface CompanyModel extends Company {
  id: ObjectID;
}

export type userType = 'company' | 'user';

export interface GeneralUser {
  type: userType;
  userData: CompanyModel | UserModel;
}

export function isCompany(user: UserModel | CompanyModel): user is CompanyModel {
  return (user as UserModel).provider === undefined;
}
