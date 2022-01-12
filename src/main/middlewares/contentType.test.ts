import request from 'supertest';
import app from '../config/app';

describe('Content-Type Middleware', () => {
  test('Should default content-type default as json', async () => {
    app.get('/test_content_type', (_req, res) => {
      return res.send();
    });

    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  });

  test('Should return xml type when forced', async () => {
    app.get('/test_content_type_xml', (_req, res) => {
      res.type('xml');
      return res.send();
    });

    await request(app)
      .get('/test_content_type_xml')
      .expect('content-type', /xml/)
  });
});
