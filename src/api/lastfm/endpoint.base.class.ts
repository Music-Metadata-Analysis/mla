import { body, validationResult } from "express-validator";
import nextConnect from "next-connect";
import { knownStatuses } from "../../config/api";
import * as status from "../../config/status";
import LastFMProxy from "../../integrations/lastfm/proxy.class";
import type { ProxyError } from "../../errors/proxy.error.class";
import type { NextApiRequest, NextApiResponse } from "next";

export default abstract class LastFMApiEndpointFactory {
  proxy!: LastFMProxy;
  route!: string;

  abstract getProxyResponse(userName: string): void;

  create() {
    const handler = nextConnect<NextApiRequest, NextApiResponse>({
      onNoMatch: this.onNoMatch,
    });
    handler.post(
      this.route,
      body("userName").isString(),
      body("userName").isLength({ min: 1 }),
      async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json(status.STATUS_400_MESSAGE);
        } else {
          this.proxy = new LastFMProxy();
          try {
            const proxyResponse = await this.getProxyResponse(
              req.body.userName
            );
            res.status(200).json(proxyResponse);
          } catch (err) {
            this.errorResponse(err as ProxyError, res);
          }
        }
        next();
      }
    );
    return handler;
  }

  errorResponse(err: ProxyError, res: NextApiResponse) {
    if (err.clientStatusCode && knownStatuses[err.clientStatusCode]) {
      res
        .status(err.clientStatusCode)
        .json(knownStatuses[err.clientStatusCode]);
    } else {
      res.status(502).json(status.STATUS_502_MESSAGE);
    }
  }

  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    res.status(405).json(status.STATUS_405_MESSAGE);
  }
}
