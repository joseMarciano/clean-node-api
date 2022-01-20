import { DbAddSurvey } from './DbAddSurvey';
import {
  AddSurvey,
  AddSurveyModel,
  AddSurveyRepository
} from './dbAddSurveyProtocols';

interface SutTypes {
  sut: AddSurvey
  addSurveyRepositoryStub: AddSurveyRepository
}
const makeSut = (): SutTypes => {
  const addSurveyRepositoryStub = makeAddSurveyRepository();
  const sut = new DbAddSurvey(addSurveyRepositoryStub);

  return {
    sut,
    addSurveyRepositoryStub
  }
}

const makeAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add (data: AddSurveyModel): Promise<void> {
      return Promise.resolve(null);
    }
  }

  return new AddSurveyRepositoryStub();
}

const makeFakeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: {
      answer: 'any_answer',
      image: 'any_image'
    }
  }
}

describe('DbAddSurvey use case', () => {
  test('Should call AddSurveyRepository with correct values', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    const addSpy = jest.spyOn(addSurveyRepositoryStub, 'add');
    await sut.add(makeFakeSurveyModel());

    expect(addSpy).toHaveBeenCalledWith(makeFakeSurveyModel())
  });
  test('Should throw if AddSurveyRepository throws', async () => {
    const { sut, addSurveyRepositoryStub } = makeSut();

    jest.spyOn(addSurveyRepositoryStub, 'add').mockRejectedValueOnce(new Error());

    const promise = sut.add(makeFakeSurveyModel());

    await expect(promise).rejects.toThrow();
  });
})
