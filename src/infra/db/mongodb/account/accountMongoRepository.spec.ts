import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongoHelper';
import { AccountMongoRepository } from './AccountMongoRepository';

let accountCollection: Collection;

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.deleteMany({});
  })

  const makeSut = (): AccountMongoRepository => new AccountMongoRepository();

  describe('INTERFACE AddAccountRepository', () => {
    test('Should return an account on add success', async () => {
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
  })

  describe('INTERFACE LoadAccountByEmailRepository', () => {
    test('Should return an account on loadByEmail success', async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'any_password'
      })

      const account = await sut.loadByEmail('any_mail@email.com');

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_mail@email.com');
      expect(account.password).toBe('any_password');
    });

    test('Should return null on loadByEmail fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByEmail('any_mail@email.com');

      expect(account).toBeFalsy();
    });
  })

  describe('INTERFACE UpdateAccessTokenRepository', () => {
    test('Should update the account access token on updateAccessToken success', async () => {
      const sut = makeSut();

      const result = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'any_password'
      });

      const accountSaved = await accountCollection.findOne({ _id: result.insertedId });
      console.log('Account saved', accountSaved)
      expect(accountSaved.accessToken).toBeFalsy();

      await sut.updateAccessToken(accountSaved._id, 'any_token');
      const accountUpdated = await accountCollection.findOne({ _id: result.insertedId });
      console.log('Account updated', accountUpdated);

      expect(accountUpdated).toBeTruthy();
      expect(accountUpdated.accessToken).toBe('any_token');
    });
  })

  describe('INTERFACE LoadAccountByTokenRepository', () => {
    test('Should load an account by token on loadByToken without role success', async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      });

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_mail@email.com');
      expect(account.password).toBe('any_password');
    })

    test('Should load an account by token on loadByToken success with admin role', async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      });

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeTruthy();
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_mail@email.com');
      expect(account.password).toBe('any_password');
    })

    test('Should return null on loadByToken with invalid role', async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'any_password',
        accessToken: 'any_token'
      });

      const account = await sut.loadByToken('any_token', 'admin')

      expect(account).toBeFalsy()
    })

    test('Should return an account on loadByToken if user is admin', async () => {
      const sut = makeSut();

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_mail@email.com',
        password: 'any_password',
        accessToken: 'any_token',
        role: 'admin'
      });

      const account = await sut.loadByToken('any_token')

      expect(account).toBeTruthy()
      expect(account.id).toBeTruthy();
      expect(account.name).toBe('any_name');
      expect(account.email).toBe('any_mail@email.com');
      expect(account.password).toBe('any_password');
    })

    test('Should return null if loadByToken fails', async () => {
      const sut = makeSut();

      const account = await sut.loadByToken('any_token', 'any_role');

      expect(account).toBeNull()
    })
  })
});
