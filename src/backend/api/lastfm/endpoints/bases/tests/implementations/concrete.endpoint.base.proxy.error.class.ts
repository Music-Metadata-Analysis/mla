import LastFMEndpointBase from "@src/backend/api/lastfm/endpoints/bases/endpoint.base.class";
import { ProxyError } from "@src/backend/api/lastfm/proxy/error/proxy.error.class";
import type { RequestPathParamType } from "@src/types/api/request.types";

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected async getProxyResponse(_: RequestPathParamType): Promise<never[]> {
    throw new ProxyError(this.mockError, this.errorCode);
    return [];
  }
}
