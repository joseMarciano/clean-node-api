/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { adaptMiddleware } from '../adapters/express/expressMiddlewareAdapter';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeAddSurveyController } from '../factories/controllers/surveys/addSurveyControllerFactory';
import { makeAuthMiddleware } from '../factories/middlewares/authMiddlewareFactory';

export default (router: Router): void => {
  const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));

  router.post('/surveys', adminAuth, adaptRoute(makeAddSurveyController()));
}
