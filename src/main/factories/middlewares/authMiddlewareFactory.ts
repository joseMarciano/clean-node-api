import { AuthController } from '../../../presentation/controllers/auth/AuthController';
import { Middleware } from '../../../presentation/protocols';
import { makeDbLoadAccountByToken } from '../usecases/account/loadAccountByToken/dbLoadAccountByTokenFactory';

export const makeAuthMiddleware = (role?: string): Middleware => {
  return new AuthController(makeDbLoadAccountByToken(), role)
}
