import { AddSurveyModel, AddSurveyRepository } from '../../../../data/usecases/addSurvey/dbAddSurveyProtocols';
import { MongoHelper } from '../helpers/mongoHelper';

export class SurveyMongoRespository implements AddSurveyRepository {
  async add (data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys');
    await surveyCollection.insertOne(data);
  }
}
