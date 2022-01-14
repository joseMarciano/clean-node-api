import { Encrypter } from '../../../data/protocols/criptography/Encrypter'

import jwt from 'jsonwebtoken';

export class JwtAdapter implements Encrypter {
  constructor (
    private readonly secretKey: string
  ) { }

  async encrypt (value: string): Promise<string> {
    return Promise.resolve(jwt.sign({ id: value }, this.secretKey));
  }
}
