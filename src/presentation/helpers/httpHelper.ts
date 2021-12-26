import { ServerError } from '../errors/ServerError';
import { HttpResponse } from '../protocols/Http';

const badRequest = (error: Error): HttpResponse =>
  ({
    statusCode: 400,
    body: error
  });

const serverError = (): HttpResponse =>
  ({
    statusCode: 500,
    body: new ServerError()
  });

export {
  badRequest,
  serverError
}
