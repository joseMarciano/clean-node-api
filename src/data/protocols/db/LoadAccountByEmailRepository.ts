import { AccountModel } from '../../usecases/addaccount/dbAddAccountProtocols';

export interface LoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>
}
