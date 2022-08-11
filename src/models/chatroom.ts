import { ObjectID } from 'bson';
import mongo from 'mongoose';
import chatSchema from '@/models/chat';
import { ChatRoom } from '@/interfaces/chat';

const schema = new mongo.Schema<ChatRoom>({
  user: { type: ObjectID, ref: 'User', required: true },
  company: { type: ObjectID, ref: 'Company', required: true },
  msgs: [chatSchema],
});

const ChatRoomModel = mongo.model<ChatRoom>('ChatRoom', schema);
export default ChatRoomModel;
