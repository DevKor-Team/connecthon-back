import CompanyModel from '@/models/company'
import { ServiceResult } from '@/interfaces/common'
import { CompanySignup } from '@/interfaces/auth';
import * as Password from '@/utils/password';

export const authenticateCompany = async (username: string, password: string): Promise<ServiceResult<CompanySignup>> => {
  const company = await CompanyModel.findOne({ username });
  if (!company)
    return { data: undefined };
  if (company.password && !(await Password.verify(company.password, password)))
    return { data: undefined };
  return { data: company };
}