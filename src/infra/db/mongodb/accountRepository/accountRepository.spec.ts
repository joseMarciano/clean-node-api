import { AddAccountRepository } from '../../../../data/protocols/db/AddAccountRepository';
import { MongoHelper } from '../helpers/mongoHelper';
import { AccountMongoRepository } from './AccountMongoRepository';

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    const accountColletion = await MongoHelper.getCollection('accounts');
    await accountColletion.deleteMany({});
  })

  const makeSut = (): AddAccountRepository => new AccountMongoRepository();

  test('Should return an account on succes', async () => {
    const sut = makeSut();

    const account = await sut.add({
      name: 'any_name',
      email: 'any_mail@email.com',
      password: 'any_password'
    });

    expect(account).toBeTruthy();
    expect(account.id).toBeTruthy();
    expect(account.name).toBe('any_name');
    expect(account.email).toBe('any_mail@email.com');
    expect(account.password).toBe('any_password');
  });
});
