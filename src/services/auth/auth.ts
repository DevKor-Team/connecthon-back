/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import CompanyModel from '@/models/company';
import { ServiceResult } from '@/interfaces/common';
import { CompanyModel as CompanyModelType } from '@/interfaces/auth';
import * as Password from '@/utils/password';

export const authenticateCompany = async (username: string, password: string): Promise<ServiceResult<CompanyModelType>> => {
  const company = await CompanyModel.findOne({ username });
  if (!company) {
    return { data: undefined };
  }
  if (company.password && !(await Password.verify(company.password, password))) {
    return { data: undefined };
  }
  const res = {
    id: company._id,
    name: company.name,
    profile: company.profile,
    level: company.level,
  };
  return {
    data: res,
  };
};
