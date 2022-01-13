import { AuthenticationModel } from '../../../domain/usecases/Authentication';
import { HashCompare } from '../../protocols/criptography/HashCompare';
import { LoadAccountByEmailRepository } from '../../protocols/db/LoadAccountByEmailRepository';
import { AccountModel } from '../addaccount/dbAddAccountProtocols';
import { DbAuthentication } from './DbAuthentication';

const makeFakeAccount = (): AccountModel => ({
  email: 'any_email@mail.com',
  id: 'any_id',
  name: 'any_name',
  password: 'hashed_password'
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (_email: string): Promise<AccountModel> {
      const account = makeFakeAccount();
      return Promise.resolve(account)
    }
  }

  return new LoadAccountByEmailRepositoryStub();
}

const makeHashCompareStub = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  return new HashCompareStub();
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompareStub();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
  }
}

const makeFakeAuthenticaction = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
});

describe('DbAuthentication', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthenticaction());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.resolve(null));
    const accessToken = await sut.auth(makeFakeAuthenticaction());
    expect(accessToken).toBeNull();
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error());

    const promise = sut.auth(makeFakeAuthenticaction());
    await expect(promise).rejects.toThrow();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');

    await sut.auth(makeFakeAuthenticaction());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });
});
