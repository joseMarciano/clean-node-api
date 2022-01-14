import { AddAccount, AddAccountModel, Hasher, AccountModel, AddAccountRepository } from './dbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountModel: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.hasher.hash(accountModel.password);

    const account = await this.addAccountRepository.add({
      ...accountModel,
      password: hashedPassword
    })

    return account;
  }
}
