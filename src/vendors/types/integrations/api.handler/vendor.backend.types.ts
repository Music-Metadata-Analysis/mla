import type { RemoteServiceError } from "@src/contracts/api/types/error.types";
import type { ParameterizedVendorApiHandlerType } from "@src/vendors/integrations/api.handler/_types/vendor.specific.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";

export interface ApiHandlerVendorFactoryInterface {
  create: () => ApiHandlerVendorHandlerType;
}

export interface ApiHandlerVendorFactoryConstructorInterface {
  errorHandler: (
    error: RemoteServiceError,
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType,
    next: () => void
  ) => void;
  fallBackHandler: (
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ) => void;
}

export type ApiHandlerVendorHandlerType = ParameterizedVendorApiHandlerType<
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType
>;

export interface ApiHandlerVendorBackendInterface {
  HandlerFactory: new (
    props: ApiHandlerVendorFactoryConstructorInterface
  ) => ApiHandlerVendorFactoryInterface;
}
