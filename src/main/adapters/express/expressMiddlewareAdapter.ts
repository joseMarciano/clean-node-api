import { NextFunction, Request, Response } from 'express';
import { HttpRequest, Middleware } from '../../../presentation/protocols';

export const adaptMiddleware = (controller: Middleware) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: req.headers
    }

    const httpResponse = await controller.handle(httpRequest);

    if (httpResponse.statusCode === 200) {
      req.body = {
        ...req.body,
        ...httpResponse.body
      }

      return next();
    }

    return res.status(httpResponse.statusCode).json({
      statusCode: httpResponse.statusCode,
      error: httpResponse.body?.message
    });
  }
}
