import LastFMEndpointBase from "@src/backend/api/services/lastfm/endpoints/bases/endpoint.base.class";
import type { ApiEndpointRequestPathParamType } from "@src/backend/api/types/services/request.types";
import type { LastFMArtistTopAlbumsInterface } from "@src/types/integrations/lastfm/api.types";

export default class ConcreteBaseProxySuccessClass extends LastFMEndpointBase {
  public errorCode?: number;
  public mockError = "mockError";

  public route = "/api/v1/endpoint";
  public timeOut = 100;

  protected setUpHandler(): void {
    this.handler.get(this.route, async (req, res, next) => {
      this.setRequestTimeout(req, res, next);
      const response = await this.getProxyResponse({});
      res.status(200).json(response);
      this.clearRequestTimeout(req);
      next();
    });
  }
  protected async getProxyResponse(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ApiEndpointRequestPathParamType
  ): Promise<LastFMArtistTopAlbumsInterface[]> {
    return Promise.resolve([]);
  }
}
