import { ObjectID } from 'bson';

export interface initSocket {
  uid: ObjectID;
  userType: 'User' | 'Company';
}

export interface SocketSession extends initSocket {
  socketid: string;
}

export interface SocketSessionModel {
  id: ObjectID;
}
