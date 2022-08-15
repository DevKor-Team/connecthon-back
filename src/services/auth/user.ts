import { ObjectID } from 'bson';
import lodash from 'lodash';
import UserModel from '@/models/user';
import { UserModel as UserModelType, User as UserType } from '@/interfaces/auth';
import { ServiceResult } from '@/interfaces/common';
import HttpError from '@/interfaces/error';
// const USER_CHANGABLE_FIELDS = ['team', 'profile'];

// read: https://github.com/microsoft/TypeScript/issues/26781

export async function get(id: ObjectID | string)
  : Promise<ServiceResult<UserModelType>> {
  const userObj = await UserModel.findById(id).populate('team');

  if (!userObj) {
    throw new HttpError(404, 'User Not Found');
  }
  return {
    data: {
      id: userObj._id,
      email: userObj.email,
      name: userObj.name,
      team: userObj.team,
      profile: userObj.profile,
      provider: userObj.provider,
      isAdmin: userObj.isAdmin,
      oauthid: userObj.oauthid,
    },
  };
}

export async function getByOauthId(oauthid: string)
  : Promise<ServiceResult<UserModelType>> {
  const user = await UserModel.findOne({ oauthid });
  if (!user) return { data: undefined };
  return {
    data: {
      id: user._id,
      email: user.email,
      name: user.name,
      team: user.team,
      profile: user.profile,
      provider: user.provider,
      isAdmin: user.isAdmin,
      oauthid: user.oauthid,
    },
  };
}

export async function getList()
  : Promise<ServiceResult<UserModelType[]>> {
  const userObjs = await UserModel.find().populate('team');
  const userList = userObjs.map((userObj) => ({
    id: userObj._id,
    email: userObj.email,
    name: userObj.name,
    team: userObj.team,
    profile: userObj.profile,
    provider: userObj.provider,
    isAdmin: userObj.isAdmin,
    oauthid: userObj.oauthid,
  }));
  return {
    data: userList,
  };
}

export async function update(id: ObjectID | string, change: Partial<UserType>, isAdmin = false):
  Promise<ServiceResult<UserModelType>> {
  const userObj = await UserModel.findById(id);
  let updates: Partial<UserType> = {};
  // todo - satisfying types... lodash.pick occurs type error
  if ('profile' in change) {
    updates.profile = change.profile;
  }
  if ('email' in change) {
    updates.email = change.email;
  }
  if ('name' in change) {
    updates.name = change.name;
  }
  if (isAdmin) {
    updates = change;
  }

  if (!userObj) {
    throw new HttpError(404, 'User Not Found');
  }
  lodash.merge(userObj, updates);
  if (change.profile?.career && userObj.profile?.career) {
    userObj.profile.career = updates.profile?.career;
  }

  const newUserObj = await userObj.save();
  return {
    data: {
      id: newUserObj._id,
      email: newUserObj.email,
      name: newUserObj.name,
      team: newUserObj.team,
      profile: newUserObj.profile,
      provider: newUserObj.provider,
      isAdmin: newUserObj.isAdmin,
      oauthid: userObj.oauthid,
    },
  };
}

export async function create(user: UserType):
  Promise<ServiceResult<UserModelType>> {
  const existingUser = await UserModel.findOne({
    $or: [{
      oauthid: user.oauthid,
    }],
  });

  if (existingUser != null) {
    if (existingUser.email === user.email && existingUser.provider === user.provider) {
      throw new HttpError(409, 'User with same email exists');
    }
    // more user filterings
    throw new HttpError(409, 'Same user exists with unknown fields');
  }
  const userObj = await UserModel.create(user);
  return {
    data: {
      id: userObj._id,
      email: userObj.email,
      name: userObj.name,
      team: userObj.team,
      profile: userObj.profile,
      provider: userObj.provider,
      isAdmin: userObj.isAdmin,
      oauthid: userObj.oauthid,
    },
  };
}

export async function deleteObj(id: ObjectID | string):
  Promise<ServiceResult<UserModelType>> {
  const userObj = await UserModel.findById(id);
  if (!userObj) {
    throw new HttpError(404, 'User Not Found');
  }
  await userObj.remove();
  return {
    data: {
      id: userObj._id,
      email: userObj.email,
      name: userObj.name,
      team: userObj.team,
      profile: userObj.profile,
      provider: userObj.provider,
      isAdmin: userObj.isAdmin,
      oauthid: userObj.oauthid,
    },
  };
}
