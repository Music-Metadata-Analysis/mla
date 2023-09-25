import ApiEndpointBase from "../../generic.endpoint.base.class";
import type { ApiEndpointRequestPathParamType } from "@src/backend/api/types/services/request.types";

export default class ConcreteBaseEndpointTimeoutErrorClass extends ApiEndpointBase<
  Record<string, never>,
  Promise<number[]>
> {
  protected proxy = {};
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
  ): Promise<number[]> {
    function timeout(ms: number) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms * 2);
      });
    }
    await timeout(this.timeOut * 2);
    return [];
  }
}
