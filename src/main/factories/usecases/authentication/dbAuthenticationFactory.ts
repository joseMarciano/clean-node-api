import { DbAuthentication } from '../../../../data/usecases/authentication/DbAuthentication';
import { Authentication } from '../../../../domain/usecases/Authentication';
import { BcryptAdapter } from '../../../../infra/criptography/bcryptAdapter/BcryptAdapter';
import { JwtAdapter } from '../../../../infra/criptography/jwtAdapter/JwtAdapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/AccountMongoRepository';
import env from '../../../config/env';

export const makeDbAuthentication = (): Authentication => {
  const SALT = 12;
  const SECRET_KEY = env.jwtSecret;
  const hashCompare = new BcryptAdapter(SALT);
  const encrypter = new JwtAdapter(SECRET_KEY);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbAuthentication(accountMongoRepository, hashCompare, encrypter, accountMongoRepository);
}
