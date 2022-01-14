import { Hasher } from '../../data/protocols/criptography/Hasher';
import bcrypt from 'bcrypt';
import { HashCompare } from '../../data/protocols/criptography/HashCompare';

export class BcryptAdapter implements Hasher, HashCompare {
  private readonly salt: number;

  constructor (salt: number) {
    this.salt = salt;
  }

  async hash (value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }

  async compare (value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash);
    return Promise.resolve(true);
  }
}
