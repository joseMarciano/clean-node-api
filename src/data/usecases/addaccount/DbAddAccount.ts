import {
  AddAccount,
  AddAccountModel,
  Hasher,
  AccountModel,
  AddAccountRepository,
  LoadAccountByEmailRepository
} from './dbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly hasher: Hasher,
    private readonly addAccountRepository: AddAccountRepository,
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  ) {}

  async add (accountModel: AddAccountModel): Promise<AccountModel> {
    const existsAccount = !!await this.loadAccountByEmailRepository.loadByEmail(accountModel.email);

    if (existsAccount) {
      return null;
    }

    const hashedPassword = await this.hasher.hash(accountModel.password);

    const account = await this.addAccountRepository.add({
      ...accountModel,
      password: hashedPassword
    })

    return account;
  }
}
