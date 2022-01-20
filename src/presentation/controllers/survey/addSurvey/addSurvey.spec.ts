import { AddSurveyController } from './AddSurveyController';
import { HttpRequest, Validation } from './addSurveyControllerProtocols';

const makeFakeRequest = (): HttpRequest => {
  return {
    body: {
      question: 'any_question',
      aswers: [{
        image: 'any_image',
        answer: 'any_answer'
      }]
    }
  }
}

interface SutTypes {
  sut: AddSurveyController
  validationStub: Validation
}

const makeValidationStub = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null;
    }
  }

  return new ValidationStub();
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidationStub();
  const sut = new AddSurveyController(validationStub);

  return {
    sut,
    validationStub
  }
}

describe('AddSurveyController', () => {
  test('Should call validation with correct values', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
