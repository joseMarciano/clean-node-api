import {
  Authentication,
  AuthenticationModel,
  HashCompare,
  Encrypter,
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository
} from './dbAuthenticationProtocols';

export class DbAuthentication implements Authentication {
  constructor (
    private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    private readonly hashCompare: HashCompare,
    private readonly encrypter: Encrypter,
    private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {}

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(authenticationModel.email);
    let passwordIsValid = false;

    if (account) {
      passwordIsValid = await this.hashCompare.compare(authenticationModel.password, account.password);
    }

    if (passwordIsValid) {
      const accessToken = await this.encrypter.encrypt(account.id);
      await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
      return accessToken;
    }

    return null;
  }
}
