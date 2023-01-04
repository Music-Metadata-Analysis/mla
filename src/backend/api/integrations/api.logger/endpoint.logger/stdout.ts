import type {
  ApiLoggerVendorEndpointLoggerInterface,
  ApiLoggerVendorEndpointLoggerType,
} from "@src/backend/api/types/integrations/api.logger/vendor.types";
import type { ApiEndpointRequestType } from "@src/backend/api/types/services/request.types";

export default class StdOutLogger
  implements ApiLoggerVendorEndpointLoggerInterface
{
  protected readonly noProxyResponseMsg = "No Response";

  public log: ApiLoggerVendorEndpointLoggerType = (req, res, next) => {
    const fields: Array<string> = [];

    const remoteIp = this.getRemoteIpAddress(req);
    const proxyResponse = this.getProxyResponse(req);

    fields.push(remoteIp);
    fields.push(String(req.method));
    fields.push(String(req.url));
    fields.push(String(res.statusCode));
    fields.push(String(req.headers["content-length"]));
    fields.push(String(req.headers["referer"]));
    fields.push(String(req.headers["user-agent"]));
    fields.push(`(LastFM Service: ${proxyResponse})`);

    console.log(fields.join(" "));

    next();
  };

  protected getRemoteIpAddress(req: ApiEndpointRequestType): string {
    if (req.socket?.remoteAddress) return req.socket.remoteAddress;

    const forwardHeader = req.headers["x-forwarded-for"];
    if (typeof forwardHeader === "string") return forwardHeader.split(",")[0];
    if (Array.isArray(forwardHeader)) return forwardHeader[0];
    return "?.?.?.?";
  }

  protected getProxyResponse(req: ApiEndpointRequestType): string {
    if (req.proxyResponse) return req.proxyResponse;
    return this.noProxyResponseMsg;
  }
}
