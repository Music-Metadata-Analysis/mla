import { knownStatuses } from "@src/config/api";
import requestSettings from "@src/config/requests";
import * as status from "@src/config/status";
import type { ProxyError } from "@src/errors/proxy.error.class";
import type {
  LastFMEndpointRequest,
  LastFMEndpointResponse,
  QueryParamType,
  BodyType,
} from "@src/types/api.endpoint.types";
import type { LastFMProxyInterface } from "@src/types/integrations/lastfm/proxy.types";
import type { NextConnect } from "next-connect";

export default abstract class LastFMEndpointBase {
  private connectionTimeout: NodeJS.Timeout | undefined;
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxyInterface;
  route!: string;

  abstract getProxyResponse(
    params: QueryParamType | BodyType
  ): ReturnType<LastFMProxyInterface[keyof LastFMProxyInterface]>;

  abstract create(): NextConnect<LastFMEndpointRequest, LastFMEndpointResponse>;

  onNoMatch = (req: LastFMEndpointRequest, res: LastFMEndpointResponse) => {
    res.status(405).json(status.STATUS_405_MESSAGE);
  };

  onError = (
    err: ProxyError,
    req: LastFMEndpointRequest,
    res: LastFMEndpointResponse,
    next: () => void
  ) => {
    this.clearTimeout(req);
    req.proxyResponse = err.toString();
    if (err.clientStatusCode && knownStatuses[err.clientStatusCode]) {
      res
        .status(err.clientStatusCode)
        .json(knownStatuses[err.clientStatusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
    next();
  };

  createTimeout = (
    req: LastFMEndpointRequest,
    res: LastFMEndpointResponse,
    next: () => void
  ) => {
    req.proxyTimeoutInstance = setTimeout(() => {
      req.proxyResponse = "Timed out! Please retry this request!";
      res.setHeader("retry-after", 0);
      res.status(503).json(status.STATUS_503_MESSAGE);
      delete req.proxyTimeoutInstance;
      next();
    }, this.timeOut);
  };

  clearTimeout = (req: LastFMEndpointRequest) => {
    if (req.proxyTimeoutInstance) {
      clearTimeout(req.proxyTimeoutInstance);
      delete req.proxyTimeoutInstance;
    }
  };
}
