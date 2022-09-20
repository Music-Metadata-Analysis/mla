import type {
  LastFMEndpointRequest,
  LastFMEndpointResponse,
} from "../../../types/api.endpoint.types";

const logger = (
  req: LastFMEndpointRequest,
  res: LastFMEndpointResponse,
  next: () => void
) => {
  const remoteIp = getRemoteIpAddress(req);

  let message = `${remoteIp} `;
  message += `${req.method} `;
  message += `${req.url} `;
  message += `${res.statusCode} `;
  message += `${req.headers["content-length"]} `;
  message += `${req.headers["referer"]} `;
  message += `${req.headers["user-agent"]} `;
  message += `(LastFM Service: ${req.proxyResponse})`;

  console.log(message);

  next();
};

const getRemoteIpAddress = (req: LastFMEndpointRequest) => {
  if (req.socket?.remoteAddress) return req.socket.remoteAddress;

  const fromForwardedHeader = req.headers["x-forwarded-for"];
  if (typeof fromForwardedHeader === "string")
    return fromForwardedHeader.split(",")[0];
  if (Array.isArray(fromForwardedHeader)) return fromForwardedHeader[0];
  return fromForwardedHeader;
};

export default logger;
