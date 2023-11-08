import { useContext, useState } from "react";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import ReportCacheCreateClient from "@src/web/api/report.cache/clients/create/report.cache.create.api.client.class";
import ReportCacheRetrieveClient from "@src/web/api/report.cache/clients/retrieve/report.cache.retrieve.api.client.class";
import useAuth from "@src/web/authentication/session/hooks/auth.hook";
import { ReportContext } from "@src/web/reports/generics/state/providers/report.provider";
import type { AuthVendorSessionType } from "@src/vendors/types/integrations/auth/vendor.types";
import type { reportDispatchType } from "@src/web/reports/generics/types/state/providers/report.context.types";
import type SunBurstBaseReportState from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type SunBurstBaseQuery from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";
import type { LastFMReportStateBase } from "@src/web/reports/lastfm/generics/types/state/providers/lastfm.report.state.types";

export type SunBurstCacheControllerProps<
  ReportType extends SunBurstBaseReportState<unknown>,
> = {
  queryClass: new () => SunBurstBaseQuery<ReportType>;
  sourceName: "lastfm" | "test";
  userName: string;
};

const useSunBurstCacheController = <
  ReportType extends SunBurstBaseReportState<unknown>,
>({
  queryClass,
  sourceName,
  userName,
}: SunBurstCacheControllerProps<ReportType>) => {
  const analytics = useAnalytics();
  const { reportProperties, dispatch } = useContext(ReportContext) as {
    reportProperties: LastFMReportStateBase;
    dispatch: reportDispatchType;
  };
  const { user } = useAuth();
  const [isCacheWritten, setCacheWritten] = useState(false);
  const query = new queryClass();

  const read = async (): Promise<{ bypassed: boolean }> => {
    const instance = new ReportCacheRetrieveClient(dispatch, analytics.event);
    return await instance.lookup({
      authenticatedUserName: String(
        (user as NonNullable<AuthVendorSessionType>).email
      ),
      reportName: query.getReportTranslationKey().toLowerCase(),
      userName,
      sourceName,
    });
  };

  const write = async (): Promise<{ bypassed: boolean }> => {
    if (isCacheWritten || isEmptyReport()) return { bypassed: true };
    setCacheWritten(true);
    const instance = new ReportCacheCreateClient(dispatch, analytics.event);
    return await instance.populate({
      authenticatedUserName: String(
        (user as NonNullable<AuthVendorSessionType>).email
      ),
      body: reportProperties,
      sourceName,
      reportName: query.getReportTranslationKey().toLowerCase(),
      userName,
    });
  };

  const isEmptyReport = () =>
    query.getReportData(reportProperties).content.length === 0;

  return {
    read,
    write,
  };
};

export default useSunBurstCacheController;

export type SunBurstCacheControllerHookType = ReturnType<
  typeof useSunBurstCacheController
>;
