import { AccountModel } from '../../domain/model/Account';
import { AddAccountModel } from '../../domain/usecases/AddAccount';

export interface AddAccountRepository {
  add(accountModel: AddAccountModel): Promise<AccountModel>
}
