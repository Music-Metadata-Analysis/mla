export class ProxyError extends Error {
  public clientStatusCode: number | undefined;

  constructor(message: string, clientStatusCode?: number) {
    super(message);
    if (clientStatusCode) this.clientStatusCode = clientStatusCode;
  }
}
