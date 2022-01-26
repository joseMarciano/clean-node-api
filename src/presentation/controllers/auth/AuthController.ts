import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken';
import { AccessDeniedError } from '../../errors';
import { forbidden, ok } from '../../helpers/httpHelper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Auth } from '../../protocols/Auth';

export class AuthController implements Auth {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token']

    if (accessToken) {
      const account = await this.loadAccountByToken.load(httpRequest.headers?.['x-access-token'])

      if (account) { return ok({ accountId: account.id }) }
    }

    return forbidden(new AccessDeniedError())
  }
}
