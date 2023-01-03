import nextConnect from "next-connect";
import type { ApiEndpointRequestType } from "@src/types/api/request.types";
import type { ApiEndpointResponseType } from "@src/types/api/response.types";
import type {
  ApiHandlerVendorFactoryInterface,
  ApiHandlerVendorFactoryConstructorInterface,
} from "@src/types/integrations/api.handler/vendor.types";
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
    ApiEndpointRequestType,
    ApiEndpointResponseType
  > {
    return nextConnect<ApiEndpointRequestType, ApiEndpointResponseType>({
      onError: this.errorHandler,
      onNoMatch: this.fallBackHandler,
    });
  }
}

export default NextConnectHandlerFactory;
