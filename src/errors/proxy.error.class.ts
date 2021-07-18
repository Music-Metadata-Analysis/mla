export class ProxyError extends Error {
  clientStatusCode: number | undefined;

  constructor(message: string, clientStatusCode?: number) {
    super(message);
    if (clientStatusCode) this.clientStatusCode = clientStatusCode;
  }
}
