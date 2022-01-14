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

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => await Promise.reject(new Error()))
    const promise = sut.hash('any_value');
    await expect(promise).rejects.toThrow();
  });

  test('Should call compare with correct values', async () => {
    const sut = makeSut();

    const compareSpy = jest.spyOn(bcrypt, 'compare');
    await sut.compare('any_value', 'any_hash');

    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash');
  });

  test('Should return true when compare succeeds', async () => {
    const sut = makeSut();

    // jest.spyOn(bcrypt, 'compare');
    const isValid = await sut.compare('any_value', 'any_hash');

    expect(isValid).toBe(true);
  });
});
