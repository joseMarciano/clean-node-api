import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './LogControllerDecorator';

interface SutTypes {
  sut: LogControllerDecorator
  controllerStub: Controller
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

const makeSut = (): SutTypes => {
  const controllerStub = makeController();
  const sut = new LogControllerDecorator(controllerStub);

  return {
    controllerStub,
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
});
