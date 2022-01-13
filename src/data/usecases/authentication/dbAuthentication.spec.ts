import { AuthenticationModel } from '../../../domain/usecases/Authentication';
import { HashCompare } from '../../protocols/criptography/HashCompare';
import { TokenGenerator } from '../../protocols/criptography/TokenGenerator';
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

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (_value: string): Promise<string> {
      return Promise.resolve('access_token');
    }
  }

  return new TokenGeneratorStub();
}

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
  const hashCompareStub = makeHashCompareStub();
  const tokenGeneratorStub = makeTokenGenerator();
  const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub, tokenGeneratorStub);

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub
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
  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockReturnValueOnce(Promise.resolve(false));
    const accessToken = await sut.auth(makeFakeAuthenticaction());
    expect(accessToken).toBeNull();
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockRejectedValueOnce(new Error());

    const promise = sut.auth(makeFakeAuthenticaction());
    await expect(promise).rejects.toThrow();
  });

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareStub } = makeSut();
    jest.spyOn(hashCompareStub, 'compare').mockRejectedValueOnce(new Error());

    const promise = sut.auth(makeFakeAuthenticaction());
    await expect(promise).rejects.toThrow();
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashCompareStub } = makeSut();
    const compareSpy = jest.spyOn(hashCompareStub, 'compare');

    await sut.auth(makeFakeAuthenticaction());

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut();

    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
    await sut.auth(makeFakeAuthenticaction());

    expect(generateSpy).toHaveBeenCalledWith('any_id');
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut();
    jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error());

    const promise = sut.auth(makeFakeAuthenticaction());
    await expect(promise).rejects.toThrow();
  });
});
