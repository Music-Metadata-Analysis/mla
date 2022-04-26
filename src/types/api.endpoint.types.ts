import type { NextApiRequest } from "next";

export interface LastFMEndpointRequest extends NextApiRequest {
  proxyResponse?: string;
}

export type QueryParamType = { [key: string]: string[] | string };
export type PathParamType = { [key: string]: string };
export type BodyType = { [key: string]: string };
