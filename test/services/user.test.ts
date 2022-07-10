/* eslint-disable no-underscore-dangle */
import * as userService from '@/services/auth/user';
import { ObjectId } from 'bson';
import { UserProvider } from '@/interfaces/auth';
import * as dbHandler from '../db-handler';
import getError from '../error';

describe('user service', () => {
  let id: ObjectId;
  const mockUser = {
    email: 'froggagul@gmail.com',
    name: {
      first: 'Jung',
      last: 'Hojin',
    },
    isAdmin: false,
    provider: UserProvider.Google,
  };

  beforeAll(async () => dbHandler.connect());
  afterAll(async () => dbHandler.close());

  it('participant create', async () => {
    const res = await userService.create(mockUser);
    // expect(res).not.toBeInstanceOf(Error);
    if (res?.data?.id) {
      id = res.data.id;
    }
    expect(res?.data).toMatchObject(mockUser);
  });

  it('invalid participant create', async () => {
    const invalidMockUser = {
      ...mockUser,
      email: '',
    };
    const error = await getError<Error>(async () => userService.create(invalidMockUser));
    expect(error).toBeInstanceOf(Error);
  });

  it('invalid participant update', async () => {
    const invalidMockUser = {
      email: 'hello@gmail.com',
    };
    const res = await userService.update(id, invalidMockUser, false);
    expect(res?.data?.email).not.toEqual(invalidMockUser.email);
  });

  it('participant get', async () => {
    expect(ObjectId.isValid(id)).toEqual(true);
    const res = await userService.get(id);
    expect(res?.data).toMatchObject(mockUser);
  });

  it('participant get list', async () => {
    const res = await userService.getList();
    expect(res?.data).toBeInstanceOf(Array);
  });

  it('participant update', async () => {
    const updateField = {
      profile: {
        img: 'https://picsum.photos/200',
        link: {
          github: 'https://github.com/froggagul',
          blog: 'https://www.hojins.life',
        },
        career: 'hello im hojin',
      },
    };
    expect(ObjectId.isValid(id)).toEqual(true);
    const res = await userService.update(id, updateField);
    expect(res?.data?.profile).toMatchObject(updateField.profile);
  });

  it('participant delete', async () => {
    expect(ObjectId.isValid(id)).toEqual(true);
    const res = await userService.deleteObj(id);
    expect(res.data).toMatchObject(mockUser);
    const error = await getError<Error>(async () => userService.get(id));
    // console.log(error);
    expect(error).toBeInstanceOf(Error);
  });
});
