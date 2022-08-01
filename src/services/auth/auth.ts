/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import CompanyModel from '@/models/company';
import { ServiceResult } from '@/interfaces/common';
import { CompanySignup } from '@/interfaces/auth';
import * as Password from '@/utils/password';

export const authenticateCompany = async (name: string, password: string): Promise<ServiceResult<CompanySignup>> => {
  const company = await CompanyModel.findOne({ name });
  if (!company) { return { data: undefined }; }
  if (company.password && !(await Password.verify(company.password, password))) { return { data: undefined }; }
  return { data: company };
};
