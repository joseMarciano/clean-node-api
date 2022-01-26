import { LogErrorRepository } from '../../data/protocols/db/log/LogErrorRepository';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly logger: LogErrorRepository
  ) {
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) { await this.logger.logError(httpResponse.body.stack as string) }

    return httpResponse;
  }
}
