import { Authentication, AuthenticationModel } from '../../../domain/usecases/Authentication';
import { HashCompare } from '../../protocols/criptography/HashCompare';
import { TokenGenerator } from '../../protocols/criptography/TokenGenerator';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;
  private readonly hashCompare: HashCompare;
  private readonly tokenGenerator: TokenGenerator;

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
    this.hashCompare = hashCompare;
    this.tokenGenerator = tokenGenerator;
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(authenticationModel.email);
    let passwordIsValid = false;
    if (account) {
      passwordIsValid = await this.hashCompare.compare(authenticationModel.password, account.password);
    }

    if (passwordIsValid) {
      return await this.tokenGenerator.generate(account.id)
    }

    return null;
  }
}
