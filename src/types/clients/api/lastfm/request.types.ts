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
  handleBegin: (userName: string) => void;
  handleNotFound: (userName: string) => void;
  handleSuccessful: (userName: string) => void;
  handleRatelimited: (userName: string) => void;
  handleFailure: (userName: string) => void;
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
