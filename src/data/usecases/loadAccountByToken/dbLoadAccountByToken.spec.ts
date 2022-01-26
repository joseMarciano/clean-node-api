import { LoadAccountByToken } from '../../../domain/usecases/LoadAccountByToken'
import { Decrypter } from '../../protocols/criptography/Decrypter'
import { DbLoadAccountByToken } from './DbLoadAccountByToken'

const makeDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (token: string): Promise<string> {
      return Promise.resolve('decripted_token')
    }
  }

  return new DecrypterStub()
}

interface SutTypes {
  sut: LoadAccountByToken
  decrypterStub: Decrypter
}
const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()
  const sut = new DbLoadAccountByToken(decrypterStub)

  return {
    sut,
    decrypterStub
  }
}

describe('DbLoadAccountByToken usecase', () => {
  test('Should Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut();

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
