import { AccountModel } from '../../../usecases/addaccount/dbAddAccountProtocols';

export interface LoadAccountByTokenRepository {
  loadByToken (token: string, role?: string): Promise<AccountModel>
}
