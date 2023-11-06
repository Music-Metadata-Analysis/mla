import EndPointLoggerMiddleware from "./middleware/endpoint.logger.middleware.class";
import TimeoutClearMiddleware from "./middleware/timeout.clear.middleware.class";
import TimeoutSetMiddleware from "./middleware/timeout.set.middleware.class";
import requestSettings from "@src/config/requests";
import * as status from "@src/config/status";
import { apiHandlerVendorBackend } from "@src/vendors/integrations/api.handler/vendor.backend";
import { apiLoggerVendorBackend } from "@src/vendors/integrations/api.logger/vendor.backend";
import type { ApiEndPointFactoryInterface } from "@src/api/types/services/endpoint.types";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type { RemoteServiceError } from "@src/contracts/api/types/services/generics/proxy/proxy.error.types";
import type {
  ApiFrameworkVendorApiRequestType,
  ApiFrameworkVendorApiResponseType,
} from "@src/vendors/types/integrations/api.framework/vendor.backend.types";
import type {
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";
import type { ApiLoggerVendorEndpointLoggerInterface } from "@src/vendors/types/integrations/api.logger/vendor.backend.types";

export default abstract class APIEndpointBase<ProxyClass, ProxyClassReturnType>
  implements ApiEndPointFactoryInterface
{
  private readonly endpointLogger: ApiLoggerVendorEndpointLoggerInterface;
  protected abstract readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  protected readonly timeOut = requestSettings.timeout;
  protected abstract proxy: ProxyClass;
  public abstract readonly service: string;
  public abstract readonly route: string;

  constructor() {
    this.endpointLogger = new apiLoggerVendorBackend.endpointLogger();
  }

  protected abstract getProxyResponse(
    params: ApiEndpointRequestQueryParamType,
    body: ApiEndpointRequestBodyType | null
  ): ProxyClassReturnType;

  protected abstract setUpHandler(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): ApiHandlerVendorRequestHandlerType;

  protected setUpMiddleware(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): void {
    middlewareStack.useBefore(
      new TimeoutSetMiddleware(this.service, this.timeOut)
    );
    middlewareStack.useAfter(new TimeoutClearMiddleware());
    middlewareStack.useAfter(new EndPointLoggerMiddleware(this.endpointLogger));
  }

  public createHandler(): ApiHandlerVendorRequestHandlerType {
    const baseHandlerMiddlewareStack =
      new apiHandlerVendorBackend.HandlerMiddleWareStack();
    this.setUpMiddleware(baseHandlerMiddlewareStack);
    const handlerFactory = new apiHandlerVendorBackend.HandlerFactory({
      baseHandler: this.setUpHandler(baseHandlerMiddlewareStack),
      errorHandler: this.errorHandler,
      route: this.route,
    });
    return handlerFactory.create();
  }

  protected clearRequestTimeout = (
    req: ApiFrameworkVendorApiRequestType
  ): void => {
    if (req.proxyTimeoutInstance) {
      clearTimeout(req.proxyTimeoutInstance);
      delete req.proxyTimeoutInstance;
    }
  };

  protected errorHandler = async (
    err: RemoteServiceError,
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ): Promise<void> => {
    this.clearRequestTimeout(req);
    req.proxyResponse = `${this.service}: ${err.toString()}`;
    if (
      err.clientStatusCode &&
      this.proxyFailureStatusCodes[err.clientStatusCode]
    ) {
      res
        .status(err.clientStatusCode)
        .json(this.proxyFailureStatusCodes[err.clientStatusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
    this.catchAllLogger(req, res);
  };

  protected isRequestTimedOut(req: ApiFrameworkVendorApiRequestType) {
    return req.proxyTimeoutInstance === undefined;
  }

  protected catchAllLogger(
    req: ApiFrameworkVendorApiRequestType,
    res: ApiFrameworkVendorApiResponseType
  ) {
    this.endpointLogger.log(req, res);
  }
}
