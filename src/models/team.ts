import { Team } from '@/interfaces/team';
import { ObjectID } from 'bson';
import mongo from 'mongoose';

const schema = new mongo.Schema<Team>({
  name: { required: true, type: String },
  users: [{ type: ObjectID, ref: 'User' }], // two way reference
  image: { required: true, type: String },
  description: { required: true, type: String },
});

const TeamModel = mongo.model<Team>('Team', schema);
export default TeamModel;
