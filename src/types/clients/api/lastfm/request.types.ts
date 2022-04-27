import type APIClient from "../../../../clients/api/api.client.class";
import type {
  EventCreatorType,
  IntegrationRequestType,
} from "../../../analytics.types";
import type { IntegrationTypes } from "../../../integrations/base.types";
import type { userDispatchType } from "../../../user/context.types";
import type { ApiResponse } from "../api.client.types";

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
