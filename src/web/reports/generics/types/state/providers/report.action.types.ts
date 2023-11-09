import type { ReportStateInterface } from "./report.state.types";
import type { ReportType } from "../generic.report.types";
import type { DataSourceType } from "@src/contracts/api/types/source.types";

export type ReportActionType =
  | {
      type: "DataPointFailureFetch";
      data: ReportType;
    }
  | {
      type: "DataPointNotFoundFetch";
      data: ReportType;
    }
  | {
      type: "DataPointStartFetch";
    }
  | {
      type: "DataPointSuccessFetch";
      data: ReportType;
    }
  | {
      type: "DataPointTimeoutFetch";
    }
  | {
      type: "FailureCreateCachedReport";
    }
  | {
      type: "FailureFetch";
      userName: string;
      integration: DataSourceType;
    }
  | {
      type: "FailureRetrieveCachedReport";
    }
  | {
      type: "NotFoundFetch";
      userName: string;
      integration: DataSourceType;
    }
  | {
      type: "RatelimitedFetch";
      userName: string;
      integration: DataSourceType;
    }
  | {
      type: "ReadyFetch";
    }
  | { type: "ResetState" }
  | {
      type: "StartCreateCachedReport";
    }
  | {
      type: "StartFetch";
      userName: string;
      integration: DataSourceType;
    }
  | {
      type: "StartRetrieveCachedReport";
      userName: string;
      integration: DataSourceType;
    }
  | {
      type: "SuccessCreateCachedReport";
    }
  | {
      type: "SuccessFetch";
      data: ReportType;
      integration: DataSourceType;
      userName: string;
      userProfile: string;
    }
  | {
      type: "SuccessRetrieveCachedReport";
      cachedReportState: ReportStateInterface;
    }
  | {
      type: "TimeoutFetch";
      userName: string;
      integration: DataSourceType;
    }
  | {
      type: "UnauthorizedFetch";
      userName: string;
      integration: DataSourceType;
    };
