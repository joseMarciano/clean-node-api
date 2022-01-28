import { DbAddSurvey } from '../../../../data/usecases/addSurvey/DbAddSurvey';
import { SurveyMongoRespository } from '../../../../infra/db/mongodb/survey/SurveyMongoRepository';
import { AddSurveyController } from '../../../../presentation/controllers/survey/addSurvey/AddSurveyController'
import { Controller } from '../../../../presentation/protocols';
import { AddSurveyValidation } from '../../../adapters/validators/survey/AddSurveyValidation';
import { makeLogControllerDecorator } from '../../decorators/logControllerDecoratorFactory'

export const makeAddSurveyController = (): Controller => {
  const surveyRepository = new SurveyMongoRespository();
  const dbAddSurvey = new DbAddSurvey(surveyRepository)
  const addSurveyController = new AddSurveyController(new AddSurveyValidation(), dbAddSurvey);
  return makeLogControllerDecorator(addSurveyController);
}
