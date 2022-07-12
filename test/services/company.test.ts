/* eslint-disable no-underscore-dangle */
import * as companyService from '@/services/auth/company';
import { ObjectId } from 'bson';
// import { UserProvider } from '@/interfaces/auth';
import * as dbHandler from '../db-handler';
import getError from '../error';

describe('company service', () => {
  let id: ObjectId;
  const mockCompany = {
    username: 'cor.nekaracube',
    password: 'asdf1234',
    name: 'company',
    profile: undefined,
    level: 0,
  };

  beforeAll(async () => dbHandler.connect());
  afterAll(async () => dbHandler.close());

  it('company create', async () => {
    const res = await companyService.create(mockCompany);
    // expect(res).not.toBeInstanceOf(Error);
    if (res?.data?.id) {
      id = res.data.id;
    }
    expect(res?.data?.name).toEqual(mockCompany.name);
  });

  it('participant get', async () => {
    expect(ObjectId.isValid(id)).toEqual(true);
    const res = await companyService.get(id);
    expect(res?.data?.name).toEqual(mockCompany.name);
  });

  it('invalid company create', async () => {
    const invalidMockCompany = {
      ...mockCompany,
      password: '',
    };
    const error = await getError<Error>(async () => companyService.create(invalidMockCompany));
    expect(error).toBeInstanceOf(Error);
  });

  it('company update', async () => {
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
    const res = await companyService.update(id, updateField);
    expect(res?.data?.profile).toMatchObject(updateField.profile);
  });

  it('participant delete', async () => {
    expect(ObjectId.isValid(id)).toEqual(true);
    const res = await companyService.deleteObj(id);
    expect(res?.data?.name).toEqual(mockCompany.name);
    const error = await getError<Error>(async () => companyService.get(id));
    // console.log(error);
    expect(error).toBeInstanceOf(Error);
  });
});
