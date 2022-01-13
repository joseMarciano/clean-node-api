import { AccountModel } from '../usecases/addaccount/dbAddAccountProtocols';

export interface LoadAccountByEmailRepository {
  load(email: string): Promise<AccountModel>
}
