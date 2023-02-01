export interface GenericAggregateBaseReportResponseInterface<
  ReportContentType,
  ParamType
> {
  status: {
    complete: boolean;
    steps_total: number;
    steps_complete: number;
    operation?: GenericAggregateReportOperationType<ParamType>;
  };
  created: string;
  content: ReportContentType;
}

export type GenericAggregateReportOperationType<ParamType> = {
  resource: string;
  type:
    | "Album Details"
    | "Artist's Albums"
    | "Top Artists"
    | "Top Albums"
    | "Track Details"
    | "User Profile";
  url: string;
  params: ParamType;
};

export interface StepInterface {
  getStep(): void;
}

export interface TransformationInterface {
  transform(): void;
}
