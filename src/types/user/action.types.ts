import type { IntegrationTypes } from "../integrations/base.types";
import type { UserReportType } from "./report.types";

export type UserActionType =
  | {
      type: "DataPointFailureFetch";
      data: UserReportType;
    }
  | {
      type: "DataPointNotFoundFetch";
      data: UserReportType;
    }
  | {
      type: "DataPointRatelimitedFetch";
    }
  | {
      type: "DataPointStartFetch";
    }
  | {
      type: "DataPointSuccessFetch";
      data: UserReportType;
    }
  | {
      type: "DataPointTimeoutFetch";
    }
  | {
      type: "FailureFetch";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "NotFoundFetch";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "RatelimitedFetch";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "ReadyFetch";
      userName: string;
      data: UserReportType;
      integration: IntegrationTypes;
    }
  | { type: "ResetState" }
  | {
      type: "StartFetch";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "SuccessFetch";
      userName: string;
      data: UserReportType;
      integration: IntegrationTypes;
    }
  | {
      type: "TimeoutFetch";
      userName: string;
      integration: IntegrationTypes;
    }
  | {
      type: "UnauthorizedFetch";
      userName: string;
      integration: IntegrationTypes;
    };
