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

describe('AddSurveyController', () => {
  test('Should call validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: any): Error {
        return null;
      }
    }

    const validationStub = new ValidationStub();
    const sut = new AddSurveyController(validationStub);

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = makeFakeRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });
});
