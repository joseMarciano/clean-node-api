import { Collection } from 'mongodb';
import request from 'supertest';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongoHelper';
import app from '../config/app';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let surveyCollection: Collection;
let accountCollection: Collection;
describe('Survey Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  });

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys');
    accountCollection = await MongoHelper.getCollection('accounts');
    await surveyCollection.deleteMany({});
    await accountCollection.deleteMany({});
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  })

  describe('POST /surveys', () => {
    test('Should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/surveys')
        .send({
          question: 'Question',
          answers: {
            answer: 'Answer 1',
            image: 'http://image-name.com'
          }
        })
        .expect(403)
    });

    test('Should return 204 with valid token', async () => {
      const result = await accountCollection.insertOne({
        name: 'José',
        email: 'marcianojosepaulo@email.com',
        password: '123',
        role: 'admin'
      });

      const accessToken = sign(result.insertedId.toString(), env.jwtSecret)

      await accountCollection.updateOne(
        {
          _id: result.insertedId
        },
        {
          $set: {
            accessToken
          }
        });

      await request(app)
        .post('/api/surveys')
        .set('x-access-token', accessToken)
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
});
