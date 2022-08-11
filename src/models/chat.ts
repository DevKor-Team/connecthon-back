import mongo from 'mongoose';
import { Chat } from '@/interfaces/chat';

const schema = new mongo.Schema<Chat>({
  sender: { required: true, type: String, enum: ['user', 'company'] },
  when: { required: true, type: Date, default: Date.now() },
  msg: { required: true, type: String },
});

export default schema;
