import { DbAddAccount } from '../../../../../data/usecases/addaccount/DbAddAccount';
import { AddAccount } from '../../../../../domain/usecases/AddAccount';
import { BcryptAdapter } from '../../../../../infra/criptography/bcryptAdapter/BcryptAdapter';
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/AccountMongoRepository';

export const makeDbAddAccount = (): AddAccount => {
  const SALT = 12;
  const accountRepository = new AccountMongoRepository();
  const hash = new BcryptAdapter(SALT);
  return new DbAddAccount(hash, accountRepository, accountRepository);
}
