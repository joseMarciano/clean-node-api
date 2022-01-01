import { ServerError } from '../errors';
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

const ok = (body: any = {}): HttpResponse =>
  ({
    statusCode: 200,
    body: body
  });

export {
  badRequest,
  serverError,
  ok
}
