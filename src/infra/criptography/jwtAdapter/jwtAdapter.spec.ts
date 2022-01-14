import { JwtAdapter } from './JwtAdapter';

import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../data/protocols/criptography/Encrypter';

interface SutTypes {
  sut: Encrypter
  SECRET: string
}

const makeSut = (): SutTypes => {
  const SECRET = 'secret'
  const sut = new JwtAdapter(SECRET);

  return {
    sut,
    SECRET
  }
}

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('any_token');
  }
}));

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const { sut, SECRET } = makeSut();

    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  });

  test('Should return a token on sign success', async () => {
    const { sut } = makeSut();

    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('any_token');
  });

  test('Should throw if sign throws', async () => {
    const { sut } = makeSut();

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() });

    const promise = sut.encrypt('any_id');

    await expect(promise).rejects.toThrow();
  });
});
