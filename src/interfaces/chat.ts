import { ObjectID } from 'bson';
import { userType } from './auth';

export interface Chat {
  sender: userType;
  when: Date;
  msg: string;
}

export interface ChatRoom {
  user: ObjectID;
  company: ObjectID;
  msgs: Chat[];
}

export interface ChatRoomModel extends ChatRoom {
  id: ObjectID
}
