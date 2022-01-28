import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash_value');
  },

  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}));

describe('BcryptAdapter', () => {
  describe('interface HASHER', () => {
    test('Should call hash with correct values', async () => {
      const sut = makeSut();
      const hashSpy = jest.spyOn(bcrypt, 'hash');
      await sut.hash('any_value');

      expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
    });

    test('Should return valid hash on hash success', async () => {
      const sut = makeSut();
      const hash = await sut.hash('any_value');

      expect(hash).toBe('hash_value');
    });

    test('Should throw if hash throws', async () => {
      const sut = makeSut();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))
      const promise = sut.hash('any_value');
      await expect(promise).rejects.toThrow();
    });
  })

  describe('interface HASHCOMPARE', () => {
    test('Should call compare with correct values', async () => {
      const sut = makeSut();
      const compareSpy = jest.spyOn(bcrypt, 'compare');
      await sut.compare('any_value', 'any_hash');

      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    test('Should return true when compare succeeds', async () => {
      const sut = makeSut();
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBe(true);
    });
    test('Should return false when compare fails', async () => {
      const sut = makeSut();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.resolve(false));
      const isValid = await sut.compare('any_value', 'any_hash');

      expect(isValid).toBe(false);
    });

    test('Should throw if compare throws', async () => {
      const sut = makeSut();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => await Promise.reject(new Error()))
      const promise = sut.compare('any_value', 'any_hash');

      await expect(promise).rejects.toThrow();
    });
  })
});
