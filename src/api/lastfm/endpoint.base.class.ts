import { body, validationResult } from "express-validator";
import { getToken } from "next-auth/jwt";
import nextConnect from "next-connect";
import Logger from "./endpoint.logger";
import { knownStatuses } from "../../config/api";
import * as status from "../../config/status";
import LastFMProxy from "../../integrations/lastfm/proxy.class";
import type { ProxyError } from "../../errors/proxy.error.class";
import type { NextApiRequest, NextApiResponse } from "next";

export interface APIEndpointRequest extends NextApiRequest {
  proxyResponse?: string;
}

export default abstract class LastFMApiEndpointFactory {
  proxy!: LastFMProxy;
  route!: string;

  abstract getProxyResponse(userName: string): void;

  create() {
    const handler = nextConnect<APIEndpointRequest, NextApiResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    handler.post(
      this.route,
      body("userName").isString(),
      body("userName").isLength({ min: 1 }),
      async (req, res, next) => {
        const token = await getToken({
          req,
          secret: process.env.AUTH_MASTER_JWT_SECRET,
          signingKey: process.env.AUTH_MASTER_JWT_SIGNING_KEY,
        });
        const errors = validationResult(req);
        if (!token) {
          res.status(401).json(status.STATUS_401_MESSAGE);
        } else if (!errors.isEmpty()) {
          res.status(400).json(status.STATUS_400_MESSAGE);
        } else {
          this.proxy = new LastFMProxy();
          const proxyResponse = await this.getProxyResponse(req.body.userName);
          req.proxyResponse = "Success!";
          res.status(200).json(proxyResponse);
        }
        next();
      }
    );
    handler.use(Logger);
    return handler;
  }

  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json(status.STATUS_405_MESSAGE);
  }

  onError(
    err: ProxyError,
    req: APIEndpointRequest,
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
}
