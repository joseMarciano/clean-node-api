import {
  LoadAccountByTokenRepository,
  AccountModel,
  Decrypter,
  LoadAccountByToken
} from './dbLoadAccountByTokenProtocols';

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter,
    private readonly loadAccountByTokenRepository: LoadAccountByTokenRepository
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken)
    let accountModel: AccountModel = null;

    if (token) {
      accountModel = await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }

    return accountModel
  }
}
