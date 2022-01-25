import { HttpRequest, HttpResponse } from './Http';

export interface AuthController {
  handle (httpRequest: HttpRequest): Promise<HttpResponse>
}
