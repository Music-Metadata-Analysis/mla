import { getToken } from "next-auth/jwt";
import nextConnect from "next-connect";
import LastFMEndpointBase from "./endpoint.common.base";
import Logger from "./endpoint.common.logger";
import requestSettings from "../../../config/requests";
import * as status from "../../../config/status";
import LastFMProxy from "../../integrations/lastfm/proxy.class";
import type { LastFMEndpointRequest } from "../../../types/api.endpoint.types";
import type { NextApiResponse } from "next";

export default abstract class LastFMApiEndpointFactoryV2 extends LastFMEndpointBase {
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxy;
  route!: string;
  maxAgeValue!: number;

  abstract getProxyResponse(userName: string): void;

  create() {
    const handler = nextConnect<LastFMEndpointRequest, NextApiResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    handler.get(this.route, async (req, res, next) => {
      const token = await getToken({
        req,
        secret: process.env.AUTH_MASTER_JWT_SECRET,
      });
      const { username } = req.query as { [key: string]: string[] };
      if (!token) {
        res.status(401).json(status.STATUS_401_MESSAGE);
      } else if (!username || username.length !== 1) {
        res.status(400).json(status.STATUS_400_MESSAGE);
      } else {
        this.proxy = new LastFMProxy();
        const abort = this.createTimeout(req, res, next);
        const proxyResponse = await this.getProxyResponse(username[0]);
        clearTimeout(abort);
        req.proxyResponse = "Success!";
        res.setHeader("Cache-Control", [
          "public",
          `max-age=${this.maxAgeValue}`,
        ]);
        res.status(200).json(proxyResponse);
      }
      next();
    });
    handler.use(Logger);
    return handler;
  }
}
