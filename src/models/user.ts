import { User, UserProvider } from '@/interfaces/auth';
import { ObjectID } from 'bson';
import mongo from 'mongoose';
import profileSchema from '@/models/profile';

const schema = new mongo.Schema<User>({
  email: { required: true, type: String },
  name: {
    first: { required: true, type: String },
    last: { required: true, type: String },
  },
  team: { required: false, type: ObjectID }, // ref: 'Team'
  isAdmin: { required: true, type: Boolean, default: false },
  profile: profileSchema,
  provider: {
    required: true,
    type: String,
    enum: UserProvider,
  },
});

const UserModel = mongo.model<User>('User', schema);
export default UserModel;
