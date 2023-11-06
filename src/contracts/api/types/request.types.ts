export type ApiEndpointRequestBodyType = { [key: string]: string };

export type ApiEndpointRequestQueryParamType = {
  [key: string]: string[] | string;
};

export type ApiEndpointRequestPathParamType = { [key: string]: string };

export interface ApiEndpointRequestExtensions {
  authenticatedUserName?: string;
  proxyResponse?: string;
  proxyTimeoutInstance?: NodeJS.Timeout;
  validatedParams?: ApiEndpointRequestQueryParamType;
}
