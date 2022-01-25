import { AddSurveyRepository } from '../../../../data/usecases/addSurvey/dbAddSurveyProtocols';
import { SurveyMongoRespository } from './SurveyMongoRepository';
import { AddSurveyModel } from '../../../../domain/usecases/AddSurvey';
import { MongoHelper } from '../helpers/mongoHelper';
import { Collection } from 'mongodb';

const makeSut = (): AddSurveyRepository => {
  return new SurveyMongoRespository();
}

const makeFakeSurveyModel = (): AddSurveyModel => {
  return {
    question: 'any_question',
    answers: [{
      answer: 'any_answer',
      image: 'any_image'
    }]
  }
}

describe('SurveyMongoRespository', () => {
  let surveyCollection: Collection;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.deleteMany({});
  });

  test('Should add a survey on success', async () => {
    const sut = makeSut();

    await sut.add(makeFakeSurveyModel());
    const answerSaved = await surveyCollection.findOne({});

    expect(answerSaved).toBeTruthy();
    expect(answerSaved._id).toBeTruthy();
    expect(answerSaved.question).toBe('any_question');
    expect(answerSaved.answers).toEqual([{
      answer: 'any_answer',
      image: 'any_image'
    }]);
  });
});
