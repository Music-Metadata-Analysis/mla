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
      type: "RatelimitedFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "FailureFetchUser";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "SuccessFetchUser";
      userName: string;
      data: UserReportType;
      integration: IntegrationTypes;
    };
