import { Authentication, AuthenticationModel } from '../../../domain/usecases/Authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorized } from '../../helpers/httpHelper';
import { EmailValidator, HttpRequest } from '../signup/signupProtocols';
import { LoginController } from './LoginController';

const makeAuthenticaction = (): Authentication => {
  class AuthenticactionStub implements Authentication {
    async auth (authenticationModel: AuthenticationModel): Promise<string> {
      return Promise.resolve('auth');
    }
  }

  return new AuthenticactionStub();
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (_email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
}
interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticactionStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const authenticactionStub = makeAuthenticaction();
  const sut = new LoginController(emailValidatorStub, authenticactionStub);
  return {
    sut,
    emailValidatorStub,
    authenticactionStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    password: 'any_password'
  }
});

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  });

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any_email'
      }
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  });

  test('Should return 400 if an invalid is provided', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  });

  test('Should return 500 if EmailValidator throws ', async () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should return 401 if Authentication returns null', async () => {
    const { sut, authenticactionStub } = makeSut();

    jest.spyOn(authenticactionStub, 'auth').mockReturnValueOnce(Promise.resolve(null));

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(unauthorized())
  });

  test('Should return 500 if Authentication throws ', async () => {
    const { sut, authenticactionStub } = makeSut();

    jest.spyOn(authenticactionStub, 'auth').mockImplementationOnce(() => { throw new Error() });

    const httpRequest = makeFakeRequest();

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticactionStub } = makeSut();

    const spyAuthentication = jest.spyOn(authenticactionStub, 'auth');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(spyAuthentication).toHaveBeenCalledWith({
      email: 'any_email',
      password: 'any_password'
    });
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email');
  });
});
