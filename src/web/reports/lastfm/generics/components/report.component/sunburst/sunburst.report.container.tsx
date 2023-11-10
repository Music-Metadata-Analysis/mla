import { useEffect } from "react";
import useSunBurstLayoutController from "./controllers/sunburst.report.layout.controller.hook";
import SunBurstReport from "./sunburst.report.component";
import Events from "@src/web/analytics/collection/events/definitions";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useMetrics from "@src/web/metrics/collection/state/hooks/metrics.hook";
import useSunBurstController from "@src/web/reports/generics/state/controllers/sunburst/sunburst.controller.hook";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import useSunBurstCacheController from "@src/web/reports/lastfm/generics/components/report.component/sunburst/controllers/sunburst.report.cache.controller.hook";
import BillBoardProgressBar from "@src/web/ui/generics/components/billboard/billboard.progress.bar/billboard.progress.bar.component";
import type { LastFMAggregateReportResponseInterface } from "@src/contracts/api/types/services/lastfm/aggregates/lastfm.aggregate.report.types";
import type SunBurstBaseReportState from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.sunburst.base.class";
import type SunBurstBaseQuery from "@src/web/reports/lastfm/generics/state/queries/sunburst.query.base.class";
import type { LastFMSunBurstDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/sunburst.types";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

interface SunBurstReportContainerProps<
  T extends SunBurstBaseReportState<unknown>,
> {
  lastfm: reportHookAsLastFM;
  userName: string;
  queryClass: new () => SunBurstBaseQuery<T>;
}

export default function SunBurstReportContainer<
  ReportStateType extends SunBurstBaseReportState<unknown>,
>({
  lastfm,
  userName,
  queryClass,
}: SunBurstReportContainerProps<ReportStateType>) {
  const analytics = useAnalytics();
  const { t: lastFMt } = useTranslation("lastfm");
  const { t: sunBurstT } = useTranslation("sunburst");
  const metrics = useMetrics();
  const sunBurstController = useSunBurstController();
  const cache = useSunBurstCacheController<ReportStateType>({
    queryClass,
    userName,
    sourceName: "LASTFM",
  });
  const sunBurstLayoutController = useSunBurstLayoutController();

  const query = new queryClass();

  useEffect(() => {
    lastfm.clear();
    cache.read().then((result) => {
      if (result.bypassed) {
        query.startDataFetch(lastfm, userName);
      }
    });
    return () => lastfm.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (query.queryIsResumable(lastfm.reportProperties)) {
      query.startDataFetch(lastfm, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastfm.reportProperties]);

  useEffect(() => {
    if (
      query.queryIsDataReady(lastfm.reportProperties) &&
      !lastfm.reportProperties.ready
    ) {
      cache.write().then((result) => {
        if (result.bypassed) {
          lastfm.ready();
          metrics.increment("SearchMetric");
          analytics.event(
            Events.LastFM.ReportPresented(query.getAnalyticsReportType())
          );
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastfm.reportProperties]);

  useEffect(() => {
    if (!query.getReportData(lastfm.reportProperties).status.complete) return;
    analytics.event(
      query
        .getEncapsulatedNode(sunBurstController.node.selected)
        .getDrawerEvent()
    );
    sunBurstLayoutController.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sunBurstController.node.selected]);

  return (
    <LastFMErrorDisplayContainer<
      LastFMAggregateReportResponseInterface<unknown>,
      LastFMSunBurstDrawerInterface
    >
      query={query}
      reportProperties={lastfm.reportProperties}
    >
      <BillBoardProgressBar
        details={query.getProgressDetails(lastfm.reportProperties, sunBurstT)}
        titleText={lastFMt(
          `${String(query.getReportTranslationKey())}.communication`
        )}
        visible={!lastfm.reportProperties.ready}
        value={query.getProgressPercentage(lastfm.reportProperties)}
      />
      <SunBurstReport<ReportStateType>
        encapsulatedReportState={query.getEncapsulatedReportState(
          lastfm.reportProperties
        )}
        lastFMt={lastFMt}
        query={query}
        sunBurstT={sunBurstT}
        sunBurstController={sunBurstController}
        sunBurstLayoutController={sunBurstLayoutController}
        visible={lastfm.reportProperties.ready}
      />
    </LastFMErrorDisplayContainer>
  );
}
