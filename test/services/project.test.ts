import * as teamService from '@/services/team';
import * as projectService from '@/services/project';
import * as userService from '@/services/auth/user';
import { UserProvider } from '@/interfaces/auth';
import { ObjectID, ObjectId } from 'bson';
import * as dbHandler from '../db-handler';

describe('project service', () => {
  let teamId: ObjectId;
  let teamIdOrigin: ObjectId;
  let projectId: ObjectID;
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

  it('create project', async () => {
    const mockProject = {
      team: teamId,
      content: '',
      stack: [],
      likes: [],
    };
    const mockProjectOrigin = {
      team: teamIdOrigin,
      content: '',
      stack: [],
      likes: [],
    };
    const res = await projectService.create(teamId);
    expect(res?.data).toMatchObject(mockProject);
    projectId = res?.data.id;
    const resOrigin = await projectService.create(teamIdOrigin);
    expect(resOrigin?.data).toMatchObject(mockProjectOrigin);

    const makeRedundantProject = async () => { await projectService.create(teamId); };
    await expect(makeRedundantProject).rejects.toThrowError('Project already exists');
  });
  it('get project', async () => {
    const mockProject = {
      team: teamId,
      content: '',
      stack: [],
      likes: [],
    };

    const res = await projectService.get(teamId);
    expect(res?.data).toMatchObject(mockProject);

    const resList = await projectService.getList();
    expect(resList?.data).toHaveLength(2);
  });
  it('like project', async () => {
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

    const users = await Promise.all(mockUsers.map(async (mockUser) => {
      const res = await userService.create(mockUser);
      return res?.data?.id;
    }));
    const userIds = users.filter((id: ObjectID | undefined): id is ObjectID => id !== undefined);
    const update = { likes: userIds };
    const res = await projectService.update(projectId, update);
    expect(res?.data.likes).toHaveLength(2);

    const dislike = { likes: [userIds[0]] };
    const disLiked = await projectService.update(projectId, dislike);
    expect(disLiked?.data.likes).toHaveLength(1);

    const dislike2 = { likes: [userIds[1]] };
    const disLiked2 = await projectService.update(projectId, dislike2);
    expect(disLiked2?.data.likes).toHaveLength(0);
  });
  it('update project', async () => {
    const content = 'uselesss project';
    const stack = ['react', 'express'];

    const firstUpdate = { content };
    const secondUpdate = { stack };
    const expected = {
      team: teamId,
      content: 'uselesss project',
      stack: [] as string[],
      likes: [],
    };
    const res = await projectService.update(projectId, firstUpdate);
    expect(res?.data).toMatchObject(expected);

    expected.stack = stack;
    const secondRes = await (projectService.update(projectId, secondUpdate));
    expect(secondRes?.data).toMatchObject(expected);
  });
  it('delete project', async () => {
    const mockProject = {
      team: teamId,
      content: 'uselesss project',
      stack: ['react', 'express'],
      likes: [],
    };

    const res = await projectService.deleteObj(projectId);
    expect(res?.data).toMatchObject(mockProject);
  });
});
