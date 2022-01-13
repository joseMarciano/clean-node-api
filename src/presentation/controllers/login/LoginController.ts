import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signupProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest.body?.email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!httpRequest.body?.password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }

    this.emailValidator.isValid(httpRequest.body.email);
  }
}
