import { ObjectID } from 'bson';

export interface Team {
  name: string;
  users: ObjectID[];
  description: string;
  image: string;
}
