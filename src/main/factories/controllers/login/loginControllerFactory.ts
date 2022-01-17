import { Controller } from '../../../../presentation/protocols'
import { LoginController } from '../../../../presentation/controllers/login/LoginController';
import { EmailValidatorAdapter } from '../../../adapters/validators/EmailValidatorAdapter';
import { makeDbAuthentication } from '../../usecases/authentication/dbAuthenticationFactory';
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory';

export const makeLoginController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const loginController = new LoginController(emailValidator, makeDbAuthentication());
  return makeLogControllerDecorator(loginController);
}
