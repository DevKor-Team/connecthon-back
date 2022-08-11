import * as userService from '@/services/auth/user';
import * as companyService from '@/services/auth/company';
import * as ChatService from '@/services/chat';
import { ObjectID, ObjectId } from 'bson';
import { UserProvider } from '@/interfaces/auth';
import * as dbHandler from '../db-handler';

describe('user service', () => {
  let userid: ObjectId;
  let company2id: ObjectId;
  let companyid: ObjectId;
  let roomid: ObjectID;
  let room2;
  let when;
  const mockUser = {
    email: 'froggagul@gmail.com',
    name: {
      first: 'Jung',
      last: 'Hojin',
    },
    isAdmin: false,
    provider: UserProvider.Google,
  };
  const mockCompany = {
    username: 'cor.nekaracube',
    password: 'asdf1234',
    name: 'company',
    profile: undefined,
    level: 0,
  };
  const mockCompany2 = {
    username: 'co11r.nekaracube',
    password: 'as11df1234',
    name: 'compa1ny',
    profile: undefined,
    level: 0,
  };

  beforeAll(async () => dbHandler.connect());
  afterAll(async () => dbHandler.close());

  it('add mocks', async () => {
    let res = await userService.create(mockUser);
    if (res?.data?.id) {
      userid = res.data.id;
    }
    res = await companyService.create(mockCompany2);
    if (res?.data?.id) {
      company2id = res.data.id;
    }
    const resOrigin = await companyService.create(mockCompany);
    // expect(res).not.toBeInstanceOf(Error);
    if (resOrigin?.data?.id) {
      companyid = resOrigin.data.id;
    }
  });

  it('create chat room', async () => {
    const res = await ChatService.create(userid, companyid);
    expect(res.data.user).toMatchObject(userid);
    expect(res.data.company).toMatchObject(companyid);
    roomid = res.data.id;
    const res2 = await ChatService.create(userid, company2id);
    room2 = res2.data.id;
    const makeRedundantRoom = async () => { await ChatService.create(userid, companyid); };
    await expect(makeRedundantRoom).rejects.toThrowError('Same room exists');
  });

  it('put chat msg', async () => {
    when = new Date();
    const res = await ChatService.update({ sender: 'user', msg: 'first', when }, roomid);
    expect(res.data).toMatchObject({
      user: userid,
      company: companyid,
    });

    expect(res.data.msgs[0]).toMatchObject({ sender: 'user', msg: 'first', when });
  });

  it('get room', async () => {
    const res = await ChatService.get(roomid);
    expect(res.data).toMatchObject({
      user: userid,
      company: companyid,
      msgs: [{ sender: 'user', msg: 'first', when }],
    });
  });

  it('get list', async () => {
    when = new Date();
    await ChatService.update({ sender: 'company', msg: 'dummy', when }, room2);
    when = new Date();
    await ChatService.update({ sender: 'company', msg: 'second', when }, room2);
    const list = await ChatService.getList(userid, 'user');

    expect(list.data[0]).toMatchObject({
      user: userid,
      company: company2id,
      lastMsg: 'second',
    });

    expect(list.data[1]).toMatchObject({
      user: userid,
      company: companyid,
      lastMsg: 'first',
    });
  });
});
