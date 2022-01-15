import { Router, Express } from 'express';
import fg from 'fast-glob';
import env from './env';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  const fileNames = fg.sync(env.routesDir());
  fileNames.map(async file => {
    const route = (await import(file)).default;
    route(router);
  })
};
