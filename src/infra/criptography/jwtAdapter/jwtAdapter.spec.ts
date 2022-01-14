import { JwtAdapter } from './JwtAdapter';

import jwt from 'jsonwebtoken';

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const SECRET = 'secret'
    const sut = new JwtAdapter(SECRET);

    const signSpy = jest.spyOn(jwt, 'sign');

    await sut.encrypt('any_id');

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, SECRET)
  });
});
