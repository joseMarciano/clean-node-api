import { AccountModel, AddAccountModel, Hasher, AddAccountRepository } from './dbAddAccountProtocols';
import { DbAddAccount } from './DbAddAccount';

interface SutTypes {
  sut: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const makeHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  return new HasherStub();
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_password'
});

const makeFakeAccountData = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountModel: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = makeFakeAccount();

      return Promise.resolve(fakeAccount)
    }
  }

  return new AddAccountRepositoryStub();
}

const makeSut = (): SutTypes => {
  const hasherStub = makeHasher();
  const addAccountRepositoryStub = makeAddAccountRepository();
  const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

  return {
    sut,
    hasherStub,
    addAccountRepositoryStub
  }
};

describe('DbAddAccount use case', () => {
  test('Should call Hasher with correct password', async () => {
    const { sut, hasherStub } = makeSut();
    const hashSpy = jest.spyOn(hasherStub, 'hash');

    const accountData = makeFakeAccountData();
    await sut.add(accountData);

    expect(hashSpy).toHaveBeenCalledWith('valid_password')
  });

  test('Should throw if Hasher throws', async () => {
    const { sut, hasherStub } = makeSut();
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(Promise.reject(new Error()));

    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  test('Should call AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    const addAccountRepositoryStubSpy = jest.spyOn(addAccountRepositoryStub, 'add');

    const accountData = makeFakeAccountData();
    await sut.add(accountData);

    expect(addAccountRepositoryStubSpy).toBeCalledWith({
      ...accountData,
      password: 'hashed_password'
    });
  });

  test('Should throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut();
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()));

    const accountData = makeFakeAccountData();
    const promise = sut.add(accountData);

    await expect(promise).rejects.toThrow();
  });

  test('Should return and account if on success', async () => {
    const { sut } = makeSut();
    const accountData = makeFakeAccountData();

    const account = await sut.add(accountData);

    expect(account).toEqual(makeFakeAccount());
  });
});
