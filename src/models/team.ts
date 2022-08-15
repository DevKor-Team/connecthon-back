import { Team, TeamModel } from '@/interfaces/team';
import { ObjectID } from 'bson';
import mongo from 'mongoose';

const schema = new mongo.Schema<Team>({
  name: { required: true, type: String },
  users: [{ type: ObjectID, ref: 'User' }], // two way reference
  image: { required: false, type: String },
  description: { required: false, type: String },
});

const TeamModel = mongo.model<TeamModel>('Team', schema);
export default TeamModel;
