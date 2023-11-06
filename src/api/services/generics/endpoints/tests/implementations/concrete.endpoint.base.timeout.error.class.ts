import ApiEndpointBase from "../../generic.endpoint.base.class";
import { serviceFailureStatusCodes } from "@src/config/api";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";
import type {
  ApiEndpointRequestQueryParamType,
  ApiEndpointRequestBodyType,
} from "@src/contracts/api/types/request.types";
import type {
  ApiHandlerVendorMiddlewareStackInterface,
  ApiHandlerVendorRequestHandlerType,
} from "@src/vendors/types/integrations/api.handler/vendor.backend.types";

export default class ConcreteBaseEndpointTimeoutErrorClass extends ApiEndpointBase<
  Record<string, never>,
  Promise<number[]>
> {
  protected proxy = {};
  protected readonly proxyFailureStatusCodes: {
    [index: number]: HttpApiClientStatusMessageType;
  };
  public route = "/api/v1/endpoint";
  public timeOut = 10;
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
      if (!this.isRequestTimedOut(req)) {
        res.status(200).json(response);
        next();
      }
    });
  }

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    params: ApiEndpointRequestQueryParamType,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: ApiEndpointRequestBodyType | null
  ): Promise<number[]> {
    function timeout(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await timeout(this.timeOut * 2);
    return Promise.resolve([]);
  }
}
