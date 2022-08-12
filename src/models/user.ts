import { User, UserProvider } from '@/interfaces/auth';
import { ObjectID } from 'bson';
import mongo from 'mongoose';
import profileSchema from '@/models/profile';

const schema = new mongo.Schema<User>({
  email: { required: false, type: String },
  name: {
    first: { required: false, type: String },
    last: { required: false, type: String },
  },
  isAdmin: { required: true, type: Boolean, default: false },
  profile: profileSchema,
  provider: {
    required: true,
    type: String,
    enum: UserProvider,
  },
  team: { required: false, type: ObjectID, ref: 'Team' },
  oauthid: { required: true, type: String },
});

const UserModel = mongo.model<User>('User', schema);
export default UserModel;
