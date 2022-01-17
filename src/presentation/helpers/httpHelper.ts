import { ServerError } from '../errors/ServerError';
import { Unauthorized } from '../errors/Unauthorized';
import { HttpResponse } from '../protocols/Http';

const badRequest = (error: Error): HttpResponse =>
  ({
    statusCode: 400,
    body: error
  });

const forbidden = (error: Error): HttpResponse =>
  ({
    statusCode: 403,
    body: error
  });

const unauthorized = (): HttpResponse =>
  ({
    statusCode: 401,
    body: new Unauthorized()
  });

const serverError = (error: Error): HttpResponse =>
  ({
    statusCode: 500,
    body: new ServerError(error.stack)
  });

const ok = (body: any): HttpResponse =>
  ({
    statusCode: 200,
    body: body
  });

export {
  badRequest,
  serverError,
  ok,
  unauthorized,
  forbidden
}
