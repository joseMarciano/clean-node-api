import { LogErrorRepository } from '../../data/protocols/LogErrorRepository';
import { serverError } from '../../presentation/helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './LogControllerDecorator';

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
  logErrorRepositoryStub: LogErrorRepository
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    async handle (_httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: {
          email: 'any_mail@mail.com',
          name: 'any_name',
          password: '123',
          passwordConfirmation: '123'
        },
        statusCode: 200
      }
      return Promise.resolve(httpResponse)
    }
  }
  return new ControllerStub();
}

const makeLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async log (stack: string): Promise<void> {
      return Promise.resolve();
    }
  }

  return new LogErrorRepositoryStub();
}

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    controllerStub,
    logErrorRepositoryStub,
    sut
  }
}

describe('Log Controller Decorator', () => {
  test('Should call controller handle', async () => {
    const { controllerStub, sut } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  });

  test('Should return the same result of controller', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse).toEqual({
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      },
      statusCode: 200
    })
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut()
    const fakeError = new Error();
    fakeError.stack = 'any_stack';
    const error = serverError(fakeError);

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(Promise.resolve(error));

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    }

    await sut.handle(httpRequest);
    expect(logSpy).toHaveBeenCalledWith('any_stack')
  });
});
