import LastFMEndpointBase from "@src/backend/api/services/lastfm/endpoints/bases/endpoint.base.class";
import { ProxyError } from "@src/backend/api/services/lastfm/proxy/error/proxy.error.class";
import type { ApiEndpointRequestPathParamType } from "@src/backend/api/types/services/request.types";

export default class ConcreteBaseProxyErrorClass extends LastFMEndpointBase {
  public errorCode?: number;
  public mockError = "mockError";

  public route = "/api/v1/endpoint";
  public timeOut = 100;

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      this.setRequestTimeout(req, res, next);
      const response = await this.getProxyResponse({});
      res.status(200).json(response);
      next();
    });
  }

  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiEndpointRequestPathParamType
  ): Promise<never[]> {
    throw new ProxyError(this.mockError, this.errorCode);
    return [];
  }
}
