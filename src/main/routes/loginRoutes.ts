/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeLoginController } from '../factories/controllers/login/login/loginControllerFactory';
import { makeSignUpController } from '../factories/controllers/login/signup/signUpControllerFactory';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
}
