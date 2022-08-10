import mongo from 'mongoose';
import { Profile } from '@/interfaces/auth';

const profileSchema = new mongo.Schema<Profile>({
  img: { required: false, type: String },
  link: {
    github: { required: false, type: String },
    blog: { required: false, type: String },
    instagram: { required: false, type: String },
  },
  position: { required: false, type: String },
  career: [{ required: false, type: String }],
  major: { required: false, type: String },
  university: { required: false, type: String },
  introduction: { required: false, type: String },
});

export default profileSchema;
