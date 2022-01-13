import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelper';
import { LoginController } from './LoginController';

const makeSut = (): LoginController => {
  return new LoginController();
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut();

    const httpRequest = {
      body: {
        password: 'any_password'
      }
    };

    const errorHandled = await sut.handle(httpRequest);

    expect(errorHandled).toEqual(badRequest(new MissingParamError('email')))
  });
});
