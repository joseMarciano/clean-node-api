import { AddAccountRepository } from '../../../../data/protocols/db/account/AddAccountRepository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/account/LoadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/account/UpdateAccessTokenRepository';
import { LoadAccountByTokenRepository } from '../../../../data/usecases/loadAccountByToken/dbLoadAccountByTokenProtocols';
import { AccountModel } from '../../../../domain/model/Account';
import { AddAccountModel } from '../../../../domain/usecases/AddAccount';
import { MongoHelper } from '../helpers/mongoHelper';

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountModel: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts');
    const result = await accountColletion.insertOne(accountModel);
    const account = await accountColletion.findOne({ _id: result.insertedId })

    return MongoHelper.map(account);
  }

  async loadByEmail (email: string): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts');
    const account = await accountColletion.findOne({ email });
    return MongoHelper.map(account);
  }

  async updateAccessToken (id: string, token: string): Promise<void> {
    const accountColletion = await MongoHelper.getCollection('accounts');

    await accountColletion.updateOne(
      {
        _id: id
      },
      {
        $set: {
          accessToken: token
        }
      })
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel> {
    return await Promise.resolve(null)
  }
}
