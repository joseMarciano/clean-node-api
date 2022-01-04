import { AddAccount, AddAccountModel, Encrypter, AccountModel, AddAccountRepository } from './dbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add (accountModel: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(accountModel.password);

    const account = await this.addAccountRepository.add({
      ...accountModel,
      password: encryptedPassword
    })

    return account;
  }
}
