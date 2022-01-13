import { Controller, HttpRequest, HttpResponse, Authentication, EmailValidator } from './loginProtocols';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, ok, serverError, unauthorized } from '../../helpers/httpHelper';
export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly authenticaction: Authentication;

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator;
    this.authenticaction = authentication;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) {
        return Promise.resolve(badRequest(new MissingParamError('email')));
      }

      if (!password) {
        return Promise.resolve(badRequest(new MissingParamError('password')));
      }

      const emailIsValid = this.emailValidator.isValid(email);

      if (!emailIsValid) return Promise.resolve(badRequest(new InvalidParamError('email')));

      const accessToken = await this.authenticaction.auth({ email, password });

      if (!accessToken) {
        return unauthorized();
      }

      return ok(accessToken);
    } catch (error) {
      return serverError(error);
    }
  }
}
