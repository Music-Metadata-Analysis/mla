import { getToken } from "next-auth/jwt";
import nextConnect from "next-connect";
import LastFMEndpointBase from "./endpoint.common.base.class";
import Logger from "./endpoint.common.logger";
import requestSettings from "../../../config/requests";
import * as status from "../../../config/status";
import flagVendor from "../../integrations/flags/vendor";
import LastFMProxy from "../../integrations/lastfm/proxy.class";
import type {
  LastFMEndpointRequest,
  PathParamType,
} from "../../../types/api.endpoint.types";
import type { NextApiResponse } from "next";

export default abstract class LastFMApiEndpointFactoryV2 extends LastFMEndpointBase {
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxy;
  route!: string;
  maxAgeValue!: number;
  delay = 500;
  flag: string | null = null;

  getParams(req: LastFMEndpointRequest): [PathParamType, boolean] {
    const params = req.query as PathParamType;
    const error = !params.username;
    return [params, error];
  }

  isProxyResponseValid(proxyResponse: { [key: string]: unknown } | unknown[]) {
    if (proxyResponse) return true;
    return false;
  }

  create() {
    const handler = nextConnect<LastFMEndpointRequest, NextApiResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    handler.get(this.route, async (req, res, next) => {
      await this.waitToAvoidRateLimiting();
      const token = await getToken({
        req,
        secret: process.env.AUTH_MASTER_JWT_SECRET,
      });
      const [params, paramErrors] = this.getParams(req);
      if (!token) {
        this.unauthorizedRequest(res);
      } else if (paramErrors) {
        this.invalidRequest(res);
      } else if (!(await this.isEnabled())) {
        res.status(404).json(status.STATUS_404_MESSAGE);
      } else {
        const proxyResponse = await this.queryProxy(req, res, next, params);
        if (this.isProxyResponseValid(proxyResponse)) {
          this.validProxyResponse(req, res, proxyResponse);
        } else {
          this.invalidProxyResponse(req, res);
        }
      }
      next();
    });
    handler.use(Logger);
    return handler;
  }

  private async isEnabled() {
    if (!this.flag) return true;

    const client = new flagVendor.Client(
      process.env.NEXT_PUBLIC_FLAG_ENVIRONMENT
    );

    return await client.isEnabled(this.flag);
  }

  private waitToAvoidRateLimiting() {
    return new Promise((resolve) => setTimeout(resolve, this.delay));
  }

  private unauthorizedRequest(res: NextApiResponse) {
    res.status(401).json(status.STATUS_401_MESSAGE);
  }

  private invalidRequest(res: NextApiResponse) {
    res.status(400).json(status.STATUS_400_MESSAGE);
  }

  private async queryProxy(
    req: LastFMEndpointRequest,
    res: NextApiResponse,
    next: () => void,
    params: PathParamType
  ) {
    this.proxy = new LastFMProxy();
    this.createTimeout(req, res, next);
    const proxyResponse = await this.getProxyResponse(params);
    this.clearTimeout();
    return proxyResponse;
  }

  private validProxyResponse(
    req: LastFMEndpointRequest,
    res: NextApiResponse,
    proxyResponse: { [key: string]: unknown } | unknown[]
  ) {
    req.proxyResponse = "Success!";
    res.setHeader("Cache-Control", ["public", `max-age=${this.maxAgeValue}`]);
    res.status(200).json(proxyResponse);
  }

  private invalidProxyResponse(
    req: LastFMEndpointRequest,
    res: NextApiResponse
  ) {
    req.proxyResponse = "Invalid LAST.FM response, please retry.";
    res.setHeader("retry-after", 0);
    res.status(503).json(status.STATUS_503_MESSAGE);
  }
}
