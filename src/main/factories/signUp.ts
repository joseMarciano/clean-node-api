import { DbAddAccount } from '../../data/usecases/addaccount/DbAddAccount';
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/AccountMongoRepository';
import { SignUpController } from '../../presentation/controllers/signup/SignUpController';
import { Controller } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter';
import { LogControllerDecorator } from '../decorators/LogControllerDecorator';

export const makeSignUpController = (): Controller => {
  const SALT = 12;
  const emailValidator = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const encrypt = new BcryptAdapter(SALT);
  const addAccount = new DbAddAccount(encrypt, addAccountRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);
  return new LogControllerDecorator(signUpController);
}
