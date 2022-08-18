import { CompanySignup } from '@/interfaces/auth';
import mongo from 'mongoose';
import profileSchema from '@/models/profile';

const schema = new mongo.Schema<CompanySignup>({
  alias: { required: true, type: String },
  logo: { required: true, type: String },
  username: { required: true, type: String },
  password: { required: true, type: String },
  name: { required: true, type: String },
  level: { required: true, type: Number, default: 0 },
  profile: profileSchema,
});

const CompanyModel = mongo.model<CompanySignup>('Company', schema);
export default CompanyModel;
