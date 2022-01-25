import { AccessDeniedError } from '../../errors';
import { forbidden } from '../../helpers/httpHelper';
import { HttpRequest, HttpResponse } from '../../protocols';
import { Auth } from '../../protocols/Auth';

export class AuthController implements Auth {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest?.headers) return forbidden(new AccessDeniedError())

    return Promise.resolve(null)
  }
}
