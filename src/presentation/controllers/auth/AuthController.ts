import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken';
import { AccessDeniedError } from '../../errors';
import { forbidden, ok, serverError } from '../../helpers/httpHelper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Auth } from '../../protocols/Auth';

export class AuthController implements Auth {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest?.headers?.['x-access-token']

      if (accessToken) {
        const account = await this.loadAccountByToken.load(httpRequest.headers?.['x-access-token'], this.role)

        if (account) { return ok({ accountId: account.id }) }
      }

      return forbidden(new AccessDeniedError())
    } catch (error) {
      return serverError(error)
    }
  }
}
