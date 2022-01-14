import { Encrypter } from '../../../data/protocols/criptography/Encrypter'

import jwt from 'jsonwebtoken';

export class JwtAdapter implements Encrypter {
  private readonly secretKey: string;

  constructor (secretKey: string) {
    this.secretKey = secretKey;
  }

  async encrypt (value: string): Promise<string> {
    return Promise.resolve(jwt.sign({ id: value }, this.secretKey));
  }
}
