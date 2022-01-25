import { Controller } from '.';
import { HttpRequest, HttpResponse } from './Http';

export interface Auth extends Controller {
  handle (httpRequest: HttpRequest): Promise<HttpResponse>
}
