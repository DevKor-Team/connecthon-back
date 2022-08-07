import { ObjectID } from 'bson';

export type stack = 'react' | 'express'; // ...

export interface Project {
  content: string;
  team: ObjectID;
  stack: string[]; // stack[]
}
