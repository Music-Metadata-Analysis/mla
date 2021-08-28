import type { IntegrationTypes } from "../integration.types";
import type { UserReportType } from "./report.types";

export type UserActionType =
  | { type: "ResetState" }
  | {
      type: "StartFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "FailureFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "RatelimitedFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "NotFoundFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "SuccessFetchUser";
      userName: string;
      data: UserReportType;
      integration: IntegrationTypes;
    };

export type UserActionType2 = {
  FailureFetchUser: {
    type: "FailureFetchUser";
    userName: string;
    integration: IntegrationTypes;
  };
  RatelimitUser: {
    type: "RatelimitedFetchUser";
    userName: string;
    integration: IntegrationTypes;
  };
  ResetState: { type: "ResetState" };
  StartFetchuser: {
    type: "StartFetchUser";
    userName: string;
    integration: IntegrationTypes;
  };
  SuccessFetchuser: {
    type: "SuccessFetchUser";
    userName: string;
    data: UserReportType;
    integration: IntegrationTypes;
  };
};
