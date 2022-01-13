import { Authentication, AuthenticationModel } from '../../../domain/usecases/Authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository;

  constructor (loadAccountByEmailRepository: LoadAccountByEmailRepository) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository;
  }

  async auth (authenticationModel: AuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authenticationModel.email);
    return Promise.resolve(null);
  }
}
