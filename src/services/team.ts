import { ObjectID } from 'bson';
import TeamModel from '@/models/team';
import UserModel from '@/models/user';
import { TeamModel as TeamModelType, Team as TeamType } from '@/interfaces/team';
import { ServiceResult } from '@/interfaces/common';

// eslint-disable-next-line import/prefer-default-export
export async function get(id: ObjectID | string)
  : Promise<ServiceResult<TeamModelType>> {
  const teamObj = await TeamModel.findById(id);
  if (!teamObj) {
    throw Error('Team Not Found');
  }
  return {
    data: {
      id: teamObj._id,
      name: teamObj.name,
      users: teamObj.users,
      description: teamObj.description,
      image: teamObj.image,
    },
  };
}

export async function getList()
  : Promise<ServiceResult<TeamModelType[]>> {
  const teamObjs = await TeamModel.find();
  const teamList = teamObjs.map((teamObj) => ({
    id: teamObj._id,
    name: teamObj.name,
    users: teamObj.users,
    description: teamObj.description,
    image: teamObj.image,
  }));
  return {
    data: teamList,
  };
}

export async function create(team: TeamType):
  Promise<ServiceResult<TeamModelType>> {
  const existingTeam = await TeamModel.findOne({
    $or: [{
      name: team.name,
    }],
  });

  if (existingTeam != null) {
    throw Error('Team with same name exists');
  }

  const teamObj = await TeamModel.create(team);
  return {
    data: {
      id: teamObj._id,
      name: teamObj.name,
      users: teamObj.users,
      description: teamObj.description,
      image: teamObj.image,
    },
  };
}

export async function addUser(id: ObjectID | string, userId: ObjectID | string):
  Promise<ServiceResult<TeamModelType>> {
  const teamObj = await TeamModel.findById(id);
  if (teamObj == null) {
    throw Error('Team does not exists');
  }
  const userObj = await UserModel.findById(userId);
  if (userObj == null) {
    throw Error('User does not exists');
  }
  if (!(userObj.team == null)) { // check null or undefined
    await TeamModel.findByIdAndUpdate(userObj.team, {
      $pull: {
        users: { _id: userId },
      },
    });
  }
  userObj.team = new ObjectID(id);
  await userObj.save();

  teamObj.users.push(new ObjectID(userId));
  const newTeamObj = await teamObj.save();

  return {
    data: {
      id: newTeamObj._id,
      name: newTeamObj.name,
      users: newTeamObj.users,
      description: newTeamObj.description,
      image: newTeamObj.image,
    },
  };
}

// export async function removeUser(id: ObjectID | string, user: ObjectID):
//   Promise<ServiceResult<TeamModelType>> {
//   const teamObj = await TeamModel.findById(id);
//   if (teamObj == null) {
//     throw Error('Team does not exists');
//   }
// //   teamObj.users.pull(user);
//   const newTeamObj = await teamObj.save();

//   return {
//     data: {
//       id: newTeamObj._id,
//       name: newTeamObj.name,
//       users: newTeamObj.users,
//       description: newTeamObj.description,
//       image: newTeamObj.image,
//     },
//   };
// }

export async function update(id: ObjectID | string, change: Partial<TeamType>, isAdmin = false):
  Promise<ServiceResult<TeamModelType>> {
  const teamObj = await TeamModel.findById(id);
  const updates: Partial<TeamType> = {};
  // todo - satisfying types... lodash.pick occurs type error
  if ('image' in change && change.image) {
    updates.image = change.image;
  }
  if ('description' in change && change.description) {
    updates.description = change.description;
  }
  if ('name' in change && change.image) {
    updates.image = change.image;
  }

  if (!teamObj) {
    throw Error('Team Not Found');
  }
  Object.assign(teamObj, updates);
  const newTeamObj = await teamObj.save();
  return {
    data: {
      id: newTeamObj._id,
      name: newTeamObj.name,
      users: newTeamObj.users,
      description: newTeamObj.description,
      image: newTeamObj.image,
    },
  };
}

export async function deleteObj(id: ObjectID | string):
  Promise<ServiceResult<TeamModelType>> {
  const teamObj = await TeamModel.findById(id);
  if (!teamObj) {
    throw Error('Team Not Found');
  }
  await teamObj.remove();
  return {
    data: {
      id: teamObj._id,
      name: teamObj.name,
      users: teamObj.users,
      description: teamObj.description,
      image: teamObj.image,
    },
  };
}
