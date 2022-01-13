import { AddAccountRepository } from '../../../../data/protocols/db/AddAccountRepository';
import { AccountModel } from '../../../../domain/model/Account';
import { AddAccountModel } from '../../../../domain/usecases/AddAccount';
import { MongoHelper } from '../helpers/mongoHelper';

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountModel: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getCollection('accounts');
    const result = await accountColletion.insertOne(accountModel);

    return {
      id: result.insertedId.toString(),
      ...accountModel
    };
  }
}
