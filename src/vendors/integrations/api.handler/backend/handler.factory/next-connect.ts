import nextConnect from "next-connect";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorFactoryInterface,
  ApiHandlerVendorFactoryConstructorInterface,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { NextConnect } from "next-connect";

class NextConnectHandlerFactory implements ApiHandlerVendorFactoryInterface {
  protected errorHandler: ApiHandlerVendorFactoryConstructorInterface["errorHandler"];
  protected fallBackHandler: ApiHandlerVendorFactoryConstructorInterface["fallBackHandler"];

  constructor({
    errorHandler,
    fallBackHandler,
  }: ApiHandlerVendorFactoryConstructorInterface) {
    this.errorHandler = errorHandler;
    this.fallBackHandler = fallBackHandler;
  }

  public create(): NextConnect<
    ApiFrameworkVendorApiRequestType,
    ApiFrameworkVendorApiResponseType
  > {
    return nextConnect<
      ApiFrameworkVendorApiRequestType,
      ApiFrameworkVendorApiResponseType
    >({
      onError: this.errorHandler,
      onNoMatch: this.fallBackHandler,
    });
  }
}

export default NextConnectHandlerFactory;
