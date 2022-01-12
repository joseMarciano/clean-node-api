import { MongoHelper } from '../infra/db/mongodb/helpers/mongoHelper';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => await runServer())
  .catch(console.error);

async function runServer (): Promise<void> {
  const app = (await import('./config/app')).default;
  app.listen(env.port, () => console.log(`Server running at http:localhost:${env.port}`));
}
