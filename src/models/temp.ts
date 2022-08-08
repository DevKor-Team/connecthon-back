import { ObjectID } from 'bson';
import mongo from 'mongoose';
import { Project } from '@/interfaces/project';

const schema = new mongo.Schema<Project>({
  team: { required: true, type: ObjectID, ref: 'Team' },
  stack: [{ type: String }],
  content: { type: String },
});

const TempModel = mongo.model<Project>('Temp', schema);
export default TempModel;
