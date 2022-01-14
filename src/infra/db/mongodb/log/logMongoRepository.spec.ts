import { Collection, Document } from 'mongodb';
import { MongoHelper } from '../helpers/mongoHelper';
import { LogMongoRepository } from './LogMongoRepository';

const makeSut = (): LogMongoRepository => new LogMongoRepository();

describe('Log Mongo Repository', () => {
  let logCollection = null as Collection<Document>;

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  beforeEach(async () => {
    logCollection = await MongoHelper.getCollection('errors');
    await logCollection.deleteMany({});
  })

  test('Should create an error log on success', async () => {
    const sut = makeSut();

    await sut.logError('any_error');

    const count = await logCollection.countDocuments();
    expect(count).toBe(1);
  });
});
