import { knownStatuses } from "../../../config/api";
import requestSettings from "../../../config/requests";
import * as status from "../../../config/status";
import type { ProxyError } from "../../../errors/proxy.error.class";
import type { LastFMEndpointRequest } from "../../../types/api.endpoint.types";
import type LastFMProxy from "../../integrations/lastfm/proxy.class";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextConnect } from "next-connect";

export default abstract class LastFMEndpointBase {
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxy;
  route!: string;

  abstract getProxyResponse(userName: string): void;

  abstract create(): NextConnect<LastFMEndpointRequest, NextApiResponse>;

  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json(status.STATUS_405_MESSAGE);
  }

  onError(
    err: ProxyError,
    req: LastFMEndpointRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    req.proxyResponse = err.toString();
    if (err.clientStatusCode && knownStatuses[err.clientStatusCode]) {
      res
        .status(err.clientStatusCode)
        .json(knownStatuses[err.clientStatusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
    next();
  }

  createTimeout(
    req: LastFMEndpointRequest,
    res: NextApiResponse,
    next: () => void
  ) {
    return setTimeout(() => {
      req.proxyResponse = "Timed out! Please retry this request!";
      res.setHeader("retry-after", 0);
      res.status(503).json(status.STATUS_503_MESSAGE);
      next();
    }, this.timeOut);
  }
}
