import { AccountModel } from '../../../domain/model/Account';
import { AddAccount, AddAccountModel } from '../../../domain/usecases/AddAccount';
import { Encrypter } from '../../protocols/Encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);

    return Promise.resolve(null);
  }
}
