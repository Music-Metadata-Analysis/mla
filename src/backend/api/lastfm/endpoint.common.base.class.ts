import { knownStatuses } from "../../../config/api";
import requestSettings from "../../../config/requests";
import * as status from "../../../config/status";
import type { ProxyError } from "../../../errors/proxy.error.class";
import type {
  LastFMEndpointRequest,
  QueryParamType,
  BodyType,
} from "../../../types/api.endpoint.types";
import type LastFMProxy from "../../integrations/lastfm/proxy.class";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextConnect } from "next-connect";

export default abstract class LastFMEndpointBase {
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxy;
  route!: string;
  private connectionTimeout: NodeJS.Timeout | undefined;

  abstract getProxyResponse(params: QueryParamType | BodyType): Promise<
    | {
        [key: string]: unknown;
      }
    | unknown[]
  >;

  abstract create(): NextConnect<
    LastFMEndpointRequest,
    NextApiResponse<unknown>
  >;

  onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
    res.status(405).json(status.STATUS_405_MESSAGE);
  };

  onError = (
    err: ProxyError,
    req: LastFMEndpointRequest,
    res: NextApiResponse,
    next: () => void
  ) => {
    this.clearTimeout();
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
    res: NextApiResponse,
    next: () => void
  ) => {
    this.connectionTimeout = setTimeout(() => {
      req.proxyResponse = "Timed out! Please retry this request!";
      res.setHeader("retry-after", 0);
      res.status(503).json(status.STATUS_503_MESSAGE);
      next();
    }, this.timeOut);
  };

  clearTimeout = () => {
    if (this.connectionTimeout) clearTimeout(this.connectionTimeout);
  };
}
