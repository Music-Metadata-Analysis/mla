import { body, validationResult } from "express-validator";
import { getToken } from "next-auth/jwt";
import nextConnect from "next-connect";
import LastFMEndpointBase from "./endpoint.common.base";
import Logger from "./endpoint.common.logger";
import requestSettings from "../../../config/requests";
import * as status from "../../../config/status";
import LastFMProxy from "../../integrations/lastfm/proxy.class";
import type {
  LastFMEndpointRequest,
  BodyType,
} from "../../../types/api.endpoint.types";
import type { NextApiResponse } from "next";

export default abstract class LastFMApiEndpointFactoryV1 extends LastFMEndpointBase {
  sunsetDate = new Date("Wed, 1 Jan 2023 00:00:00 GMT");
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxy;
  route!: string;

  abstract getProxyResponse(params: BodyType): void;

  create() {
    const handler = nextConnect<LastFMEndpointRequest, NextApiResponse>({
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
        });
        const errors = validationResult(req);
        if (!token) {
          res.status(401).json(status.STATUS_401_MESSAGE);
        } else if (!errors.isEmpty()) {
          res.status(400).json(status.STATUS_400_MESSAGE);
        } else {
          this.proxy = new LastFMProxy();
          const abort = this.createTimeout(req, res, next);
          const proxyResponse = await this.getProxyResponse(req.body);
          clearTimeout(abort);
          req.proxyResponse = "Success!";
          res.setHeader("Sunset", this.sunsetDate.toDateString());
          res.status(200).json(proxyResponse);
        }
        next();
      }
    );
    handler.use(Logger);
    return handler;
  }
}
