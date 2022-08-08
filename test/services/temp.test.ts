import * as teamService from '@/services/team';
import * as projectService from '@/services/project';
import * as tempService from '@/services/temp';
import { ObjectID, ObjectId } from 'bson';
import * as dbHandler from '../db-handler';

describe('temporate service', () => {
  let teamId: ObjectId;

  let projectId: ObjectID;
  const mockTeam = {
    name: 'KORDEV',
    users: [],
    description: 'future GOAT',
    image: 'https://image.com/1243',
  };

  beforeAll(async () => dbHandler.connect());
  afterAll(async () => dbHandler.close());

  it('team create', async () => {
    const res = await teamService.create(mockTeam);
    if (res?.data?.id) {
      teamId = res.data.id;
    }
    expect(res?.data).toMatchObject(mockTeam);
  });

  it('create project', async () => {
    const mockProject = {
      team: teamId,
      content: '',
      stack: [],
      likes: [],
    };

    const res = await projectService.create(teamId);
    expect(res?.data).toMatchObject(mockProject);
    projectId = res?.data.id;
  });

  it('create temp', async () => {
    const mockTemp = {
      team: teamId,
      content: '',
      stack: [],
    };
    const res = await tempService.create(teamId);
    expect(res?.data).toMatchObject(mockTemp);

    const makeRedundantTemp = async () => { await tempService.create(teamId); };
    await expect(makeRedundantTemp).rejects.toThrowError('Temp already exists');
  });

  it('get temp', async () => {
    const mockTemp = {
      team: teamId,
      content: '',
      stack: [],
    };

    const res = await tempService.get(teamId);
    expect(res?.data).toMatchObject(mockTemp);
  });

  it('update temp', async () => {
    const content = 'uselesss project';
    const stack = ['react', 'express'];

    const firstUpdate = { content };
    const secondUpdate = { stack };
    const expected = {
      team: teamId,
      content: 'uselesss project',
      stack: [] as string[],
    };
    const res = await tempService.update(teamId, firstUpdate);
    expect(res?.data).toMatchObject(expected);

    expected.stack = stack;
    const secondRes = await (tempService.update(teamId, secondUpdate));
    expect(secondRes?.data).toMatchObject(expected);
  });

  it('delete temp', async () => {
    const mockTemp = {
      team: teamId,
      content: 'uselesss project',
      stack: ['react', 'express'],
    };

    const res = await tempService.deleteObj(teamId);
    expect(res?.data).toMatchObject(mockTemp);
  });
});
