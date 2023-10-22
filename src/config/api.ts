import * as status from "@src/config/status";
import type { HttpApiClientStatusMessageType } from "@src/contracts/api/types/clients/http.client.types";

type statusCodeConfig = {
  [statusCode: number]: HttpApiClientStatusMessageType;
};

export const serviceFailureStatusCodes: {
  lastfm: statusCodeConfig;
  reportCache: statusCodeConfig;
} = {
  lastfm: {
    401: status.STATUS_401_MESSAGE,
    404: status.STATUS_404_MESSAGE,
    429: status.STATUS_429_MESSAGE,
    503: status.STATUS_503_MESSAGE,
  },
  reportCache: {
    401: status.STATUS_401_MESSAGE,
  },
};

export const proxyFailureStatusCodes: {
  lastfm: statusCodeConfig;
  reportCacheCreate: statusCodeConfig;
  reportCacheRetrieve: statusCodeConfig;
} = {
  lastfm: {
    401: status.STATUS_401_MESSAGE,
    404: status.STATUS_404_MESSAGE,
    429: status.STATUS_429_MESSAGE,
    503: status.STATUS_503_MESSAGE,
  },
  reportCacheCreate: {},
  reportCacheRetrieve: {
    404: status.STATUS_404_MESSAGE,
  },
};
