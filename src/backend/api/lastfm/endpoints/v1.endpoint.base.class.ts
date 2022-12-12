import { body, validationResult } from "express-validator";
import LastFMEndpointBase from "./bases/endpoint.base.class";
import authVendor from "@src/backend/integrations/auth/vendor";
import * as status from "@src/config/status";

export default abstract class LastFMApiEndpointFactoryV1 extends LastFMEndpointBase {
  public readonly sunsetDate = new Date("Wed, 1 Jan 2023 00:00:00 GMT");

  protected setUpHandler(): void {
    this.handler.post(
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
          this.setRequestTimeout(req, res, next);
          const proxyResponse = await this.getProxyResponse(req.body);
          this.clearRequestTimeout(req);
          req.proxyResponse = "Success!";
          res.setHeader("Sunset", this.sunsetDate.toDateString());
          res.status(200).json(proxyResponse);
        }
        next();
      }
    );
  }
}
