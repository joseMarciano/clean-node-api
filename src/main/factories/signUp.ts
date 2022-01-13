import { DbAddAccount } from '../../data/usecases/addaccount/DbAddAccount';
import { BcryptAdapter } from '../../infra/criptography/BcryptAdapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/AccountMongoRepository';
import { LogMongoRepository } from '../../infra/db/mongodb/logRepository/LogMongoRepository';
import { SignUpController } from '../../presentation/controllers/signup/SignUpController';
import { Controller } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/EmailValidatorAdapter';
import { LogControllerDecorator } from '../decorators/LogControllerDecorator';

export const makeSignUpController = (): Controller => {
  const SALT = 12;
  const emailValidator = new EmailValidatorAdapter();
  const addAccountRepository = new AccountMongoRepository();
  const hash = new BcryptAdapter(SALT);
  const addAccount = new DbAddAccount(hash, addAccountRepository);
  const signUpController = new SignUpController(emailValidator, addAccount);
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(signUpController, logMongoRepository);
}
