import { AccountModel } from '../model/Account';

export interface LoadAccountByToken {
  load(accessToken: string, role?: string): Promise<AccountModel>
}
