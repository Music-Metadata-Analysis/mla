import LastFMReportBaseClient from "../../lastfm.api.client.base.class";

export default class ConcreteLastFMBaseClient<
  ReportType
> extends LastFMReportBaseClient<ReportType> {
  route = "/api/v2/some/route/:username";
}
