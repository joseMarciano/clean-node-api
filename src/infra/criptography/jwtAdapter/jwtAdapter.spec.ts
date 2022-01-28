import { JwtAdapter } from './JwtAdapter';
import jwt from 'jsonwebtoken';

interface SutTypes {
  sut: JwtAdapter
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
  },
  async verify (): Promise<string> {
    return Promise.resolve('any_value')
  }
}));

describe('Jwt Adapter', () => {
  describe('interface ENCRYPTER', () => {
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
  })

  describe('INTERFACE Decrypter', () => {
    test('Should call verify with correct values', async () => {
      const { sut, SECRET } = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify')

      await sut.decrypt('any_token')

      expect(verifySpy).toHaveBeenCalledWith('any_token', SECRET)
    })
    test('Should return a value on verify success', async () => {
      const { sut } = makeSut();

      const value = await sut.decrypt('any_token')

      expect(value).toBe('any_value')
    })
  })
});
