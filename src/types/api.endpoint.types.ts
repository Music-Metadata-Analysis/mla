import type { NextApiRequest } from "next";

export interface LastFMEndpointRequest extends NextApiRequest {
  proxyResponse?: string;
}
