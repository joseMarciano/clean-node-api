import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helpers/httpHelper';
import { Auth } from '../../protocols/Auth'
import { AuthController } from './AuthController';

interface SutTypes {
  sut: Auth
}
const makeSut = (): SutTypes => {
  const sut = new AuthController();

  return {
    sut
  }
}

describe('AuthController', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
