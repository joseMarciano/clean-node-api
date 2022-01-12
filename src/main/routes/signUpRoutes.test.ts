import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';
import app from '../config/app';

describe('SignUp Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  beforeEach(async () => {
    await MongoHelper.getCollection('accounts').deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'José Paulo Zanardo Marciano',
        email: 'marcianojosepaulo@outlook.com',
        password: '123456789',
        passwordConfirmation: '123456789'
      })
      .expect(200)
  });
});
