export interface RemoteServiceError extends Error {
  clientStatusCode: number | undefined;
}
