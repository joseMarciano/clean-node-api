import { DbLoadAccountByToken } from '../../../../../data/usecases/loadAccountByToken/DbLoadAccountByToken';
import { LoadAccountByToken } from '../../../../../domain/usecases/LoadAccountByToken';
import { JwtAdapter } from '../../../../../infra/criptography/jwtAdapter/JwtAdapter';
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/AccountMongoRepository';
import env from '../../../../config/env';

export const makeDbLoadAccountByToken = (): LoadAccountByToken => {
  const decrypter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(decrypter, accountMongoRepository)
}
