import { AccessDeniedError } from '../../errors';
import { forbidden, ok, serverError } from '../../helpers/httpHelper';
import { AuthController } from './AuthController';
import { HttpRequest, Auth } from '../../protocols';
import { AccountModel, LoadAccountByToken } from './authControllerProtocols';

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password'
})

const makeLoadAccountByToken = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return Promise.resolve(makeFakeAccount())
    }
  }

  return new LoadAccountByTokenStub()
}

interface SutTypes {
  sut: Auth
  loadAccountByTokenStub: LoadAccountByToken
}
const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthController(loadAccountByTokenStub, role);

  return {
    sut,
    loadAccountByTokenStub
  }
}

describe('AuthController', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return call LoadAccountByToken with correct access-token', async () => {
    const { sut, loadAccountByTokenStub } = makeSut('any_role');

    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })

  test('Should return 403 if LoadAccountByToken retuns null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }

    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValue(null)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken retuns an account', async () => {
    const { sut } = makeSut();

    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok({
      accountId: 'valid_id'
    }))
  })
  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }

    jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => { throw new Error() })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
