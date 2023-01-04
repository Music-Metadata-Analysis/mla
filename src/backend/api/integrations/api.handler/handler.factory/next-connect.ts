import nextConnect from "next-connect";
import type {
  ApiHandlerVendorFactoryInterface,
  ApiHandlerVendorFactoryConstructorInterface,
} from "@src/backend/api/types/integrations/api.handler/vendor.types";
import type { ApiEndpointRequestType } from "@src/backend/api/types/services/request.types";
import type { ApiEndpointResponseType } from "@src/backend/api/types/services/response.types";
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
