import { Express } from 'express';
import { bodyParser } from '../middlewares/bodyparser';

export default (app: Express): void => {
  app
    .use(bodyParser)
}
