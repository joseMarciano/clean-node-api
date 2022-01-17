import { SignUpController } from '../../../../presentation/controllers/signup/SignUpController';
import { Controller } from '../../../../presentation/protocols';
import { EmailValidatorAdapter } from '../../../adapters/validators/EmailValidatorAdapter';
import { makeDbAuthentication } from '../../usecases/authentication/dbAuthenticationFactory';
import { makeDbAddAccount } from '../../usecases/addAccount/dbAddAccountFactory';
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory';

export const makeSignUpController = (): Controller => {
  const emailValidator = new EmailValidatorAdapter();
  const signUpController = new SignUpController(emailValidator, makeDbAddAccount(), makeDbAuthentication());
  return makeLogControllerDecorator(signUpController);
}
