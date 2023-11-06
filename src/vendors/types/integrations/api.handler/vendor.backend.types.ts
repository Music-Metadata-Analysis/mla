import type { HttpApiClientHttpMethodType } from "@src/contracts/api/types/clients/http.client.types";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

export type ApiHandlerVendorRequestHandlerType = (
  req: ApiFrameworkVendorApiRequestType,
  res: ApiFrameworkVendorApiResponseType
) => Promise<void>;

export type ApiHandlerVendorRequestHandlerWithNextType = (
  req: ApiFrameworkVendorApiRequestType,
  res: ApiFrameworkVendorApiResponseType,
  next: () => Promise<void>
) => Promise<void>;

export type ApiHandlerVendorRequestHandlerWithNextAndFinishedType = (
  req: ApiFrameworkVendorApiRequestType,
  res: ApiFrameworkVendorApiResponseType,
  next: () => Promise<void>,
  finished: () => Promise<void>
) => Promise<void>;

export interface ApiHandlerVendorMiddlewareInterface {
  handler: ApiHandlerVendorRequestHandlerWithNextAndFinishedType;
}

export interface ApiHandlerVendorMiddlewareStackInterface {
  useAfter(middleware: ApiHandlerVendorMiddlewareInterface): void;
  useBefore(middleware: ApiHandlerVendorMiddlewareInterface): void;
  createHandler(
    method: HttpApiClientHttpMethodType,
    handler: ApiHandlerVendorRequestHandlerWithNextType
  ): ApiHandlerVendorRequestHandlerType;
}

export interface ApiHandlerVendorFactoryInterface {
  create: () => ApiHandlerVendorRequestHandlerType;
}

export interface ApiHandlerVendorFactoryConstructorInterface {
  baseHandler: ApiHandlerVendorRequestHandlerWithNextType;
  errorHandler: (
    error: RemoteServiceError,
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ) => Promise<void>;
  route: string;
}

export interface ApiHandlerVendorBackendInterface {
  HandlerFactory: new (
    props: ApiHandlerVendorFactoryConstructorInterface
  ) => ApiHandlerVendorFactoryInterface;
  HandlerMiddleWareStack: new () => ApiHandlerVendorMiddlewareStackInterface;
}
