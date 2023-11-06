import ApiEndpointBase from "../../generic.endpoint.base.class";
import { serviceFailureStatusCodes } from "@src/config/api";
import { errorVendorBackend } from "@src/vendors/integrations/errors/vendor.backend";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type {
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class ConcreteBaseProxyErrorClass extends ApiEndpointBase<
  Record<string, never>,
  Promise<number[]>
> {
  protected proxy = {};
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  public errorCode?: number;
  public mockError = "mockError";
  public route = "/api/v1/endpoint";
  public timeOut = 1000;
  public service = "mockService";

  constructor() {
    super();
    this.proxyFailureStatusCodes = { ...serviceFailureStatusCodes.lastfm };
  }

  protected setUpHandler(
    middlewareStack: ApiHandlerVendorMiddlewareStackInterface
  ): ApiHandlerVendorRequestHandlerType {
    return middlewareStack.createHandler("GET", async (req, res, next) => {
      const response = await this.getProxyResponse({}, null);
      res.status(200).json(response);
      await next();
    });
  }

  protected getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ApiEndpointRequestQueryParamType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: ApiEndpointRequestBodyType | null
  ): Promise<number[]> {
    throw new errorVendorBackend.ProxyError(this.mockError, this.errorCode);
    return Promise.resolve([]);
  }
}
