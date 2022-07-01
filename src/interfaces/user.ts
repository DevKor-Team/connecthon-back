import { ObjectID } from 'bson';

export interface UserProfile {
  img: string;
  link: {
    github: string;
    blog: string;
  };
  career: string;
}

export enum UserIdentity {
  Company = 'COMPANY',
  Participant = 'PARTICIPANT',
}

export enum UserProvider {
  Google = 'GOOGLE',
  Github = 'GITHUB',
  Devkor = 'DEVKOR',
}

export interface User {
  email: string;
  name: {
    first: string;
    last: string;
  };
  team: ObjectID; // object id
  profile?: UserProfile;
}

export interface UserSignup extends User {
  id: string;
  password: string;
  identity: UserIdentity;
  isAdmin: boolean;
  provider: UserProvider;
}
