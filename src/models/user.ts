import {
  UserSignup, UserProfile, UserIdentity, UserProvider,
} from '@/interfaces/user';
import { ObjectID } from 'bson';
import mongo from 'mongoose';

const profileSchema = new mongo.Schema<UserProfile>({
  img: { required: false, type: String },
  link: {
    github: { required: false, type: String },
    blog: { required: false, type: String },
  },
  career: { required: false, type: String },
});

const schema = new mongo.Schema<UserSignup>({
  id: { required: true, type: String },
  password: { required: true, type: String },
  identity: {
    type: String,
    enum: UserIdentity,
    default: UserIdentity.Participant,
  },
  isAdmin: { required: true, type: Boolean, default: false },
  provider: {
    type: String,
    enum: UserProvider,
  },
  email: { required: true, type: String },
  name: {
    first: { required: true, type: String },
    last: { required: true, type: String },
  },
  team: { required: false, type: ObjectID }, // ref: 'Team'
  profile: profileSchema,
});

const UserModel = mongo.model<UserSignup>('User', schema);
export default UserModel;
