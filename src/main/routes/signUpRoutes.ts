import { Router } from 'express';
import { adaptRoute } from '../adapters/express/expressRouteAdapter';
import { makeSignUpController } from '../factories/signup/signUp';

export default (router: Router): void => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/signup', adaptRoute(makeSignUpController()));
}
