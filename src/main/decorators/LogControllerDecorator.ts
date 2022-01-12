import { LogErrorRepository } from '../../data/protocols/LogErrorRepository';
import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols';

export class LogControllerDecorator implements Controller {
  private readonly controller: Controller;
  private readonly logger: LogErrorRepository;

  constructor (controller: Controller, logger: LogErrorRepository) {
    this.controller = controller;
    this.logger = logger;
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest);

    if (httpResponse.statusCode === 500) { await this.logger.log(httpResponse.body.stack as string) }

    return httpResponse;
  }
}
