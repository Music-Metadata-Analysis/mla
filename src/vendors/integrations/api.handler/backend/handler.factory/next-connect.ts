import { createRouter } from "next-connect";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorFactoryInterface,
  ApiHandlerVendorFactoryConstructorInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

class NextConnectHandlerFactory implements ApiHandlerVendorFactoryInterface {
  protected baseHandler: ApiHandlerVendorFactoryConstructorInterface["baseHandler"];
  protected errorHandler: ApiHandlerVendorFactoryConstructorInterface["errorHandler"];
  protected route: ApiHandlerVendorFactoryConstructorInterface["route"];

  constructor({
    baseHandler,
    errorHandler,
    route,
  }: ApiHandlerVendorFactoryConstructorInterface) {
    this.baseHandler = baseHandler;
    this.errorHandler = errorHandler;
    this.route = route;
  }

  public create(): ApiHandlerVendorRequestHandlerType {
    const router = createRouter<
      ApiFrameworkVendorApiRequestType,
      ApiFrameworkVendorApiResponseType
    >();
    router.all(this.route, this.baseHandler);
    return router.handler({
      onError: this.errorHandler as (
        error: unknown,
        req: ApiFrameworkVendorApiRequestType,
        res: ApiFrameworkVendorApiResponseType
      ) => void,
    });
  }
}

export default NextConnectHandlerFactory;
