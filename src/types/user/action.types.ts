import type { UserReportType } from "./report.types";
import type { DataSourceTypes } from "@src/web/reports/generics/types/source.types";

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
      integration: DataSourceTypes;
    }
  | {
      type: "NotFoundFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "RatelimitedFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "ReadyFetch";
      userName: string;
      data: UserReportType;
      integration: DataSourceTypes;
    }
  | { type: "ResetState" }
  | {
      type: "StartFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "SuccessFetch";
      userName: string;
      data: UserReportType;
      integration: DataSourceTypes;
    }
  | {
      type: "TimeoutFetch";
      userName: string;
      integration: DataSourceTypes;
    }
  | {
      type: "UnauthorizedFetch";
      userName: string;
      integration: DataSourceTypes;
    };
