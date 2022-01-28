import { Encrypter } from '../../../data/protocols/criptography/Encrypter'

import jwt from 'jsonwebtoken';
import { Decrypter } from '../../../data/protocols/criptography/Decrypter';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor (
    private readonly secretKey: string
  ) { }

  async encrypt (value: string): Promise<string> {
    return Promise.resolve(jwt.sign({ id: value }, this.secretKey));
  }

  async decrypt (value: string): Promise<string> {
    await jwt.verify(value, this.secretKey)
    return null
  }
}
