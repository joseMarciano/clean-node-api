import { LoadAccountByEmailRepository } from '../../protocols/LoadAccountByEmailRepository';
import { AccountModel } from '../addaccount/dbAddAccountProtocols';
import { DbAuthentication } from './DbAuthentication';

describe('DbAuthentication', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
      async load (_email: string): Promise<AccountModel> {
        const account: AccountModel = {
          email: 'any_email@mail.com',
          id: 'any_id',
          name: 'any_name',
          password: 'any_password'
        }
        return Promise.resolve(account)
      }
    }

    const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

    await sut.auth({
      email: 'any_email@mail.com',
      password: 'any_password'
    });

    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  })
});
