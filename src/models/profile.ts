import mongo from 'mongoose';
import { Profile } from '@/interfaces/auth';

const profileSchema = new mongo.Schema<Profile>({
  img: { required: false, type: String },
  link: {
    github: { required: false, type: String },
    blog: { required: false, type: String },
  },
  career: { required: false, type: String },
});

export default profileSchema;
