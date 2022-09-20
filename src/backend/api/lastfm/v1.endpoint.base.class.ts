import { body, validationResult } from "express-validator";
import nextConnect from "next-connect";
import LastFMEndpointBase from "./endpoint.common.base.class";
import Logger from "./endpoint.common.logger";
import requestSettings from "../../../config/requests";
import * as status from "../../../config/status";
import authVendor from "../../integrations/auth/vendor";
import LastFMProxy from "../../integrations/lastfm/proxy.class";
import type {
  LastFMEndpointRequest,
  LastFMEndpointResponse,
} from "../../../types/api.endpoint.types";

export default abstract class LastFMApiEndpointFactoryV1 extends LastFMEndpointBase {
  sunsetDate = new Date("Wed, 1 Jan 2023 00:00:00 GMT");
  timeOut = requestSettings.timeout;
  proxy!: LastFMProxy;
  route!: string;

  create() {
    const handler = nextConnect<LastFMEndpointRequest, LastFMEndpointResponse>({
      onError: this.onError,
      onNoMatch: this.onNoMatch,
    });
    handler.post(
      this.route,
      body("userName").isString(),
      body("userName").isLength({ min: 1 }),
      async (req, res, next) => {
        const authClient = new authVendor.Client(req);
        const token = await authClient.getSession();
        const errors = validationResult(req);
        if (!token) {
          res.status(401).json(status.STATUS_401_MESSAGE);
        } else if (!errors.isEmpty()) {
          res.status(400).json(status.STATUS_400_MESSAGE);
        } else {
          this.proxy = new LastFMProxy();
          this.createTimeout(req, res, next);
          const proxyResponse = await this.getProxyResponse(req.body);
          this.clearTimeout();
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
