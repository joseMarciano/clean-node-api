import { Router, Express } from 'express';
import fg from 'fast-glob';

export default (app: Express): void => {
  const router = Router();

  app.use('/api', router);

  const fileNames = fg.sync('**/src/main/routes/**Routes.ts');

  fileNames.map(async file => {
    const route = (await import(`../../../${file}`)).default;
    route(router)
  })
};
