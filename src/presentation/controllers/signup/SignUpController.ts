import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, ok } from '../../helpers/httpHelper'
import { Controller, EmailValidator, HttpResponse, HttpRequest, AddAccount, Authentication } from './signupProtocols';

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount,
    private readonly authentication: Authentication
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password, passwordConfirmation, name } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(email);
      if (!isValid) return badRequest(new InvalidParamError('email'));

      await this.addAccount.add({
        name,
        email,
        password
      });

      const accessToken = await this.authentication.auth({
        email,
        password
      });

      return ok({
        accessToken
      });
    } catch (error) {
      return serverError(error);
    }
  }
}
