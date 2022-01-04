import { AddAccount, AddAccountModel, Encrypter, AccountModel, AddAccountRepository } from './dbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountRepository: AddAccountRepository;

  constructor (encrypter: Encrypter, addAccountRepository: AddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    const encryptedPassword = await this.encrypter.encrypt(account.password);

    await this.addAccountRepository.add({
      ...account,
      password: encryptedPassword
    })

    return Promise.resolve(null);
  }
}
