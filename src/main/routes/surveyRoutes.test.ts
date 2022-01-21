import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';
import app from '../config/app';
import { hash } from 'bcrypt';

let surveyCollection: Collection;

describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  describe('POST /surveys', () => {
    test('Should return 204 on add survey success', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }
        })
        .expect(204)
    });
  });

  describe('POST /login', () => {
    test('Should return 200 on login', async () => {
      const password = await hash('123456789', 12);

      await surveyCollection.insertOne({
        name: 'José Paulo Zanardo Marciano',
        email: 'marcianojosepaulo@outlook.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'marcianojosepaulo@outlook.com',
          password: '123456789'
        })
        .expect(200)
    });

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'marcianojosepaulo@outlook.com',
          password: '123456789'
        })
        .expect(401)
    });
  });
});
