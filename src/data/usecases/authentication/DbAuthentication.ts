import { Authentication, AuthenticationModel } from '../../../domain/usecases/Authentication';
import { HashCompare } from '../../protocols/criptography/HashCompare';
import { TokenGenerator } from '../../protocols/criptography/TokenGenerator';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../protocols/db/UpdateAccessTokenRepository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashCompare: HashCompare;
  private readonly tokenGenerator: TokenGenerator;
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository;

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
    this.updateAccessTokenRepository = updateAccessTokenRepository;
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email);
    let passwordIsValid = false;

    if (account) {
      passwordIsValid = await this.hashCompare.compare(authenticationModel.password, account.password);
    }

    if (passwordIsValid) {
      const accessToken = await this.tokenGenerator.generate(account.id);
      await this.updateAccessTokenRepository.update(account.id, accessToken);
      return accessToken;
    }

    return null;
  }
}
