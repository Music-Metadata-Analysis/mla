import type { IntegrationTypes } from "../integration.types";
import type { UserReportType } from "./report.types";

export type UserActionType =
  | {
      type: "FailureFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "NotFoundFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "RatelimitedFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "ReadyFetchUser";
      userName: string;
      data: UserReportType;
      integration: IntegrationTypes;
    }
  | { type: "ResetState" }
  | {
      type: "StartFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "SuccessFetchUser";
      userName: string;
      data: UserReportType;
      integration: IntegrationTypes;
    }
  | {
      type: "TimeoutFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "UnauthorizedFetchUser";
      userName: string;
      integration: IntegrationTypes;
    };
