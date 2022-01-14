import { JwtAdapter } from './JwtAdapter';

import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return Promise.resolve('any_token');
  }
}))

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const SECRET = 'secret'
    const sut = new JwtAdapter(SECRET);

    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  });

  test('Should return a token on sign success', async () => {
    const SECRET = 'secret'
    const sut = new JwtAdapter(SECRET);

    const accessToken = await sut.encrypt('any_id');

    expect(accessToken).toBe('any_token');
  });

  test('Should throw if sign throws', async () => {
    const SECRET = 'secret'
    const sut = new JwtAdapter(SECRET);

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error() });

    const promise = sut.encrypt('any_id');

    await expect(promise).rejects.toThrow();
  });
});
