/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeLoginController } from '../factories/login/loginFactory';
import { makeSignUpController } from '../factories/signup/signUp';

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
  router.post('/login', adaptRoute(makeLoginController()));
}
