import type { RemoteServiceError } from "@src/contracts/api/types/error.types";

export class ProxyError extends Error implements RemoteServiceError {
  public clientStatusCode: number | undefined;

  constructor(message: string, clientStatusCode?: number) {
    super(message);
    if (clientStatusCode) this.clientStatusCode = clientStatusCode;
  }
}
