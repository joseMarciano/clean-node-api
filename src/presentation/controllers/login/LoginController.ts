import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../../protocols';
import { EmailValidator } from '../signup/signupProtocols';

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator;

  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email, password } = httpRequest.body;

    if (!email) {
      return Promise.resolve(badRequest(new MissingParamError('email')))
    }

    if (!password) {
      return Promise.resolve(badRequest(new MissingParamError('password')))
    }

    const emailIsValid = this.emailValidator.isValid(email);

    if (!emailIsValid) return Promise.resolve(badRequest(new InvalidParamError('email')))
  }
}
