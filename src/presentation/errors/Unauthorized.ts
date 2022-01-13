export class Unauthorized extends Error {
  constructor (error = null as Error) {
    super('Unauthorized');
    this.name = 'Unauthorized'
    this.stack = error?.stack
  }
}
