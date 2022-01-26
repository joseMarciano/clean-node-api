import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken';
import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helpers/httpHelper';
import { HttpRequest } from '../../protocols';
import { Auth } from '../../protocols/Auth'
import { AccountModel } from '../login/signup/signupProtocols';
import { AuthController } from './AuthController';

const makeFakeAccount = (): AccountModel => ({
  id: 'any_id',
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
const makeSut = (): SutTypes => {
  const loadAccountByTokenStub = makeLoadAccountByToken()
  const sut = new AuthController(loadAccountByTokenStub);

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
    const { sut, loadAccountByTokenStub } = makeSut();

    const httpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }

    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')

    await sut.handle(httpRequest)

    expect(loadSpy).toHaveBeenCalledWith('any_token')
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
})
