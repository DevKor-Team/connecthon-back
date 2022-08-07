import { ObjectID } from 'bson';
import mongo from 'mongoose';
import { Project } from '@/interfaces/project';

const schema = new mongo.Schema<Project>({
  team: { required: true, type: ObjectID, ref: 'Team' },
  stack: [{ type: String }],
  content: { type: String },
});

const ProjectModel = mongo.model<Project>('Team', schema);
export default ProjectModel;
