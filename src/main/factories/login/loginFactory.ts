import { Controller } from '../../../presentation/protocols'
import { LoginController } from '../../../presentation/controllers/login/LoginController';
import { LogControllerDecorator } from '../../decorators/LogControllerDecorator';
import { EmailValidatorAdapter } from '../../adapters/validators/EmailValidatorAdapter';
import { DbAuthentication } from '../../../data/usecases/authentication/DbAuthentication';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/LogMongoRepository';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/AccountMongoRepository';
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/BcryptAdapter';
import { JwtAdapter } from '../../../infra/criptography/jwtAdapter/JwtAdapter';
import env from '../../config/env';

export const makeLoginController = (): Controller => {
  const SALT = 12;
  const SECRET_KEY = env.jwtSecret;
  const emailValidator = new EmailValidatorAdapter();
  const loadAccountByEmailRepository = new AccountMongoRepository();
  const hashCompare = new BcryptAdapter(SALT);
  const encrypter = new JwtAdapter(SECRET_KEY);
  const authentication = new DbAuthentication(loadAccountByEmailRepository, hashCompare, encrypter, loadAccountByEmailRepository);
  const loggerErrorRepository = new LogMongoRepository();
  const loginController = new LoginController(emailValidator, authentication);

  return new LogControllerDecorator(loginController, loggerErrorRepository);
}
