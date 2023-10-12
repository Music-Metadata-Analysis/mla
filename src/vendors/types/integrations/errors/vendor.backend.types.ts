import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";

export interface ErrorVendorBackendInterface {
  ProxyError: new (
    message: string,
    clientStatusCode?: number
  ) => RemoteServiceError;
}
