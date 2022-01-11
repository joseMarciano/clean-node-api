import { AddAccountRepository } from '../../../../data/protocols/AddAccountRepository';
import { AccountModel } from '../../../../domain/model/Account';
import { AddAccountModel } from '../../../../domain/usecases/AddAccount';
import { MongoHelper } from '../helpers/mongoHelper';

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountModel: AddAccountModel): Promise<AccountModel> {
    const accountColletion = MongoHelper.getCollection('accounts');
    const result = await accountColletion.insertOne(accountModel);

    return {
      id: result.insertedId.toString(),
      ...accountModel
    };
  }
}
