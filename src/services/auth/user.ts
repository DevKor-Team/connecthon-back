import { ObjectID } from 'bson';
// import lodash from 'lodash';
import UserModel from '@/models/user';
import { UserModel as UserModelType, User as UserType } from '@/interfaces/auth';
import { ServiceResult } from '@/interfaces/common';

// const USER_CHANGABLE_FIELDS = ['team', 'profile'];

// read: https://github.com/microsoft/TypeScript/issues/26781

// eslint-disable-next-line import/prefer-default-export
export async function get(id: ObjectID | string)
: Promise<ServiceResult<UserModelType>> {
  const userObj = await UserModel.findById(id);
  if (!userObj) {
    throw Error('User Not Found');
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
    },
  };
}

export async function update(id: ObjectID | string, change: Partial<UserType>, isAdmin = false):
Promise<ServiceResult<UserModelType>> {
  const userObj = await UserModel.findById(id);
  let updates: Partial<UserType> = {};
  // todo - satisfying types... lodash.pick occurs type error
  if (!isAdmin) {
    if ('team' in change) {
      updates.team = change.team;
    }
    if ('profile' in change) {
      updates.profile = change.profile;
    }
  } else {
    updates = change;
  }

  if (!userObj) {
    throw Error('User Not Found');
  }
  Object.assign(userObj, updates);
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
    },
  };
}

export async function create(user: UserType):
Promise<ServiceResult<UserModelType>> {
  const existingUser = await UserModel.findOne({
    $or: [{
      email: user.email,
      provider: user.provider,
    }],
  });

  if (existingUser != null) {
    if (existingUser.email === user.email && existingUser.provider === user.provider) {
      throw Error('User with same email exists');
    }
    // more user filterings
    throw Error('Same user exists with unknown fields');
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
    },
  };
}

export async function deleteObj(id: ObjectID | string):
Promise<ServiceResult<UserModelType>> {
  const userObj = await UserModel.findById(id);
  if (!userObj) {
    throw Error('User Not Found');
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
    },
  };
}
