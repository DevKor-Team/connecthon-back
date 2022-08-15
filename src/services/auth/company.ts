import { ObjectID } from 'bson';
import lodash from 'lodash';
import CompanyModel from '@/models/company';
import { CompanyModel as CompanyModelType, CompanySignup } from '@/interfaces/auth';
import { ServiceResult } from '@/interfaces/common';
import { hash } from '@/utils/password';

// read: https://github.com/microsoft/TypeScript/issues/26781

export async function get(id: ObjectID | string)
  : Promise<ServiceResult<CompanyModelType>> {
  const companyObj = await CompanyModel.findById(id);
  if (!companyObj) {
    throw Error('Company Not Found');
  }
  return {
    data: {
      id: companyObj._id,
      name: companyObj.name,
      profile: companyObj.profile,
      level: companyObj.level,
    },
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
  if (!companyObj) {
    throw Error('Company Not Found');
  }
  lodash.merge(companyObj, change);
  const newCompanyObj = await companyObj.save();
  return {
    data: {
      id: newCompanyObj._id,
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
      throw Error('Company with same name exists');
    }
    // more filterings
    throw Error('Same company exists with unknown fields');
  }
  const companyPasswordHashed = {
    ...company,
    password: await hash(company.password),
  };
  const companyObj = await CompanyModel.create(companyPasswordHashed);
  return {
    data: {
      id: companyObj._id,
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
    throw Error('Company Not Found');
  }
  await companyObj.remove();
  return {
    data: {
      id: companyObj._id,
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
    throw Error('Company Not Found');
  }
  return {
    data: {
      id: companyObj._id,
      name: companyObj.name,
      profile: companyObj.profile,
      level: companyObj.level,
    },
  };
}
