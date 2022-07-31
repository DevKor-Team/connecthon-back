import * as teamService from '@/services/team';
import * as userService from '@/services/auth/user';
import { ObjectID, ObjectId } from 'bson';
import { UserProvider } from '@/interfaces/auth';
import * as dbHandler from '../db-handler';
import getError from '../error';

describe('user service', () => {
  let teamId: ObjectId;
  let teamIdOrigin: ObjectId;
  let teamUserIds: ObjectId[];
  const mockTeam = {
    name: 'KORDEV',
    users: [],
    description: 'future GOAT',
    image: 'https://image.com/1243',
  };
  const mockTeamOrigin = {
    name: 'KORDEV123',
    users: [],
    description: 'future GOAT!',
    image: 'https://imageofthings.com/12436',
  };

  const mockUsers = [{
    email: 'froggagul@gmail.com',
    name: {
      first: 'Jung',
      last: 'Hojin',
    },
    isAdmin: false,
    provider: UserProvider.Google,
  }, {
    email: 'froggagul@korea.ac.kr',
    name: {
      first: 'Jung',
      last: 'Hojin',
    },
    isAdmin: false,
    provider: UserProvider.Google,
  }];

  beforeAll(async () => dbHandler.connect());
  afterAll(async () => dbHandler.close());

  it('team create', async () => {
    const res = await teamService.create(mockTeam);
    // expect(res).not.toBeInstanceOf(Error);
    if (res?.data?.id) {
      teamId = res.data.id;
    }
    expect(res?.data).toMatchObject(mockTeam);
    const resOrigin = await teamService.create(mockTeamOrigin);
    // expect(res).not.toBeInstanceOf(Error);
    if (resOrigin?.data?.id) {
      teamIdOrigin = resOrigin.data.id;
    }
    expect(resOrigin?.data).toMatchObject(mockTeamOrigin);
  });
  it('get team', async () => {
    const res = await teamService.get(teamId);
    expect(res?.data).toMatchObject(mockTeam);
  });
  it('users create', async () => {
    const teamUsers = await Promise.all(mockUsers.map(async (mockUser) => {
      const res = await userService.create(mockUser);
      return res?.data?.id;
    }));
    teamUserIds = teamUsers.filter((id: ObjectID | undefined): id is ObjectID => id !== undefined);
    expect(teamUserIds).toHaveLength(mockUsers.length);
  });
  it('add user to team', async () => {
    await Promise.all(teamUserIds.map(async (userId) => {
      await teamService.addUser(teamId, userId);
    }));
    const res = await teamService.get(teamId);
    expect(res?.data?.users).toMatchObject(teamUserIds);
  });
  it('show user team when get', async () => {
    const userId = teamUserIds[0];
    const res = await userService.get(userId);
    console.log(res?.data);
    expect(res?.data?.team?.toString()).toBe(teamId.toString());
  });
  it('add user to another team when user is member of original team', async () => {
    const userId = teamUserIds[0];
    const res = await userService.get(userId);
    console.log(res?.data);
    expect(res?.data?.team?.toString()).toBe(teamId.toString());

    await teamService.addUser(teamIdOrigin, userId);

    const updatedUserRes = await userService.get(userId);
    expect(updatedUserRes?.data?.team?.toString()).toBe(teamIdOrigin.toString());

    const fromTeamRes = await teamService.get(teamId);
    expect(fromTeamRes?.data?.users).not.toContain(userId);

    const toTeamRes = await teamService.get(teamIdOrigin);
    expect(toTeamRes?.data?.users).toContainEqual(userId);
  });
});
