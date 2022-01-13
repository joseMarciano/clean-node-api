import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(SALT);
};

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await Promise.resolve('hash_value');
  }
}));

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const sut = makeSut();

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.hash('any_value');

    expect(hashSpy).toHaveBeenCalledWith('any_value', SALT);
  });

  test('Should return a hash on success', async () => {
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
});
