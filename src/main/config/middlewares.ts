import { Express } from 'express';
import { bodyParser } from '../middlewares/bodyparser';
import { contentType } from '../middlewares/contentType';
import { cors } from '../middlewares/cors';

export default (app: Express): void => {
  app
    .use(contentType)
    .use(bodyParser)
    .use(cors)
}
