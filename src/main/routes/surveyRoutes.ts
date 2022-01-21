/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeAddSurveyController } from '../factories/controllers/surveys/addSurveyControllerFactory';

export default (router: Router): void => {
  router.post('/surveys', adaptRoute(makeAddSurveyController()));
}
