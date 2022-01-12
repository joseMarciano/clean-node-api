import request from 'supertest';
import app from '../config/app';

describe('SignUp Routes', () => {
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
