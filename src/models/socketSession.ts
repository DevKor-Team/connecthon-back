import { ObjectID } from 'bson';
import mongo from 'mongoose';
import { SocketSession } from '@/interfaces/socketSession';

const schema = new mongo.Schema<SocketSession>({
  uid: { required: true, type: ObjectID, refPath: 'userType' },
  socketid: { required: true, type: String },
  userType: { required: true, type: String, enum: ['User', 'Company'] },
});

const SocketSessionModel = mongo.model<SocketSession>('SocketSession', schema);
export default SocketSessionModel;
