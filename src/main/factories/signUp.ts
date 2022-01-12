import { DbAddAccount } from '../../data/usecases/addaccount/DbAddAccount';
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/AccountMongoRepository';
import { SignUpController } from '../../presentation/controllers/signup/SignUpController';
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter';

export const makeSignUpController = (): SignUpController => {
  const SALT = 12;
  const emailValidator = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const encrypt = new BcryptAdapter(SALT);
  const addAccount = new DbAddAccount(encrypt, addAccountRepository);
  return new SignUpController(emailValidator, addAccount);
}
