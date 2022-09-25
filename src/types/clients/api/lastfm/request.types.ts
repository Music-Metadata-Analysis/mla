import type { ApiResponse } from "../api.client.types";
import type APIClient from "@src/clients/api/api.client.class";
import type {
  EventCreatorType,
  IntegrationRequestType,
} from "@src/types/analytics.types";
import type { IntegrationTypes } from "@src/types/integrations/base.types";
import type { userDispatchType } from "@src/types/user/context.types";

export interface LastFMReportInterface<T> {
  client: APIClient;
  dispatch: userDispatchType;
  eventDispatch: EventCreatorType;
  eventType: IntegrationRequestType;
  integration: IntegrationTypes;
  response: ApiResponse<T> | undefined;
  route: string | undefined;
  handleBegin: (params: LastFMReportParamsInterface) => void;
  handleNotFound: (params: LastFMReportParamsInterface) => void;
  handleSuccessful: (params: LastFMReportParamsInterface) => void;
  handleRatelimited: (params: LastFMReportParamsInterface) => void;
  handleTimeout: (params: LastFMReportParamsInterface) => void;
  handleUnauthorized: (params: LastFMReportParamsInterface) => void;
  handleFailure: (params: LastFMReportParamsInterface) => void;
  retrieveReport: (params: LastFMReportParamsInterface) => void;
}

export interface LastFMReportParamsInterface {
  userName: string;
  artist?: string;
  album?: string;
  track?: string;
}

export interface LastFMClientParamsInterface {
  userName: string;
  artist?: string;
  album?: string;
  track?: string;
}
