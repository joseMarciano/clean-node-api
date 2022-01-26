import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken';
import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helpers/httpHelper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Auth } from '../../protocols/Auth';

export class AuthController implements Auth {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (!accessToken) return forbidden(new AccessDeniedError())

    await this.loadAccountByToken.load(httpRequest.headers?.['x-access-token'])

    return Promise.resolve(null)
  }
}
