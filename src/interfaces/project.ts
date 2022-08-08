import { ObjectID } from 'bson';

export type stack = 'react' | 'express'; // ...

export interface ProjectTemp {
  content: string;
  team: ObjectID;
  stack: string[]; // stack[]
}

export interface Project extends ProjectTemp {
  likes: ObjectID[];
}

export interface ProjectModel extends Project {
  id: ObjectID;
}

export interface ProjectTempModel extends ProjectTemp {
  id: ObjectID;
}
