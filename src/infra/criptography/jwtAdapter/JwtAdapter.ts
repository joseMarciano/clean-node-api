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

  async decrypt (token: string): Promise<string> {
    const value = await jwt.verify(token, this.secretKey) as any
    return value
  }
}
