import { ObjectID } from 'bson';
import lodash from 'lodash';
import CompanyModel from '@/models/company';
import { CompanyModel as CompanyModelType, CompanySignup } from '@/interfaces/auth';
import { ServiceResult } from '@/interfaces/common';
import { hash } from '@/utils/password';
import HttpError from '@/interfaces/error';

// read: https://github.com/microsoft/TypeScript/issues/26781

export async function get(id: ObjectID | string)
  : Promise<ServiceResult<CompanyModelType>> {
  const companyObj = await CompanyModel.findById(id);
  if (!companyObj) {
    throw new HttpError(404, 'Company Not Found');
  }
  return {
    data: {
      id: companyObj._id,
      alias: companyObj.alias,
      logo: companyObj.logo,
      name: companyObj.name,
      profile: companyObj.profile,
      level: companyObj.level,
    },
  };
}

export async function getList()
  : Promise<ServiceResult<CompanyModelType[]>> {
  const companyObjs = await CompanyModel.find();
  const companyList = companyObjs.map((companyObj) => ({
    id: companyObj._id,
    alias: companyObj.alias,
    logo: companyObj.logo,
    name: companyObj.name,
    profile: companyObj.profile,
    level: companyObj.level,
  }));
  return {
    data: companyList,
  };
}

export async function update(
  id: ObjectID | string,
  change: Partial<CompanySignup>,
  isAdmin = false,
):
  Promise<ServiceResult<CompanyModelType>> {
  const companyObj = await CompanyModel.findById(id);
  // important! todo: set fields that only admin can change

  const updates: Partial<CompanySignup> = {};
  // todo - satisfying types... lodash.pick occurs type error
  if ('profile' in change) {
    updates.profile = change.profile;
  }
  if ('name' in change) {
    updates.name = change.name;
  }
  if (isAdmin) {
    if ('level' in change) {
      updates.level = change.level;
    }
  }

  if (!companyObj) {
    throw new HttpError(404, 'Company Not Found');
  }
  lodash.merge(companyObj, change);
  if (change.profile?.career && companyObj.profile?.career) {
    companyObj.profile.career = change.profile?.career;
  }
  const newCompanyObj = await companyObj.save();
  return {
    data: {
      id: newCompanyObj._id,
      logo: companyObj.logo,
      alias: newCompanyObj.alias,
      name: newCompanyObj.name,
      profile: newCompanyObj.profile,
      level: companyObj.level,
    },
  };
}

export async function create(company: CompanySignup):
  Promise<ServiceResult<CompanyModelType>> {
  const existingCompany = await CompanyModel.findOne({
    $or: [{
      username: company.username,
    }],
  });

  if (existingCompany != null) {
    if (existingCompany.name === company.name) {
      throw new HttpError(409, 'Company with same name exists');
    }
    // more filterings
    throw new HttpError(409, 'Same company exists with unknown fields');
  }
  const companyPasswordHashed = {
    ...company,
    password: await hash(company.password),
  };
  const companyObj = await CompanyModel.create(companyPasswordHashed);
  return {
    data: {
      id: companyObj._id,
      alias: companyObj.alias,
      logo: companyObj.logo,
      name: companyObj.name,
      profile: companyObj.profile,
      level: companyObj.level,
    },
  };
}

export async function deleteObj(id: ObjectID | string):
  Promise<ServiceResult<CompanyModelType>> {
  const companyObj = await CompanyModel.findById(id);
  if (!companyObj) {
    throw new HttpError(404, 'Company Not Found');
  }
  await companyObj.remove();
  return {
    data: {
      id: companyObj._id,
      logo: companyObj.logo,
      alias: companyObj.alias,
      name: companyObj.name,
      profile: companyObj.profile,
      level: companyObj.level,
    },
  };
}

export async function getByName(name: string):
  Promise<ServiceResult<CompanyModelType>> {
  const companyObj = await CompanyModel.findOne({ name });

  if (!companyObj) {
    throw new HttpError(404, 'Company Not Found');
  }
  return {
    data: {
      id: companyObj._id,
      logo: companyObj.logo,
      alias: companyObj.alias,
      name: companyObj.name,
      profile: companyObj.profile,
      level: companyObj.level,
    },
  };
}
