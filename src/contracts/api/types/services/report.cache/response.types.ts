export interface ReportCacheCreateResponseInterface {
  id: string;
}

export interface ReportCacheRetrieveResponseInterface<ResponseType> {
  response: ResponseType;
  cacheControl: string;
}
