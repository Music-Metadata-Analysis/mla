import { useEffect } from "react";
import FlipCardReport from "./flip.card.report.component";
import Events from "@src/web/analytics/collection/events/definitions";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useMetrics from "@src/web/metrics/collection/state/hooks/metrics.hook";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import useFlipCardController from "@src/web/reports/lastfm/generics/components/report.component/flip.card/controllers/flip.card.controller.hook";
import BillBoardSpinner from "@src/web/ui/generics/components/billboard/billboard.spinner/billboard.spinner.component";
import Condition from "@src/web/ui/generics/components/condition/condition.component";
import useImagesController from "@src/web/ui/images/state/controllers/images.controller.hook";
import type FlipCardBaseReportState from "@src/web/reports/lastfm/generics/state/encapsulations/lastfm.report.encapsulation.flipcard.base.class";
import type FlipCardAbstractBaseQuery from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";
import type { LastFMFlipCardDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/flip.card.types";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";

export interface FlipCardReportContainerProps<
  T extends FlipCardBaseReportState,
  R extends unknown[],
> {
  userName: string;
  lastfm: reportHookAsLastFM;
  queryClass: new () => FlipCardAbstractBaseQuery<T, R>;
}

export default function FlipCardReportContainer<
  ReportEncapsulation extends FlipCardBaseReportState,
  ReportDataType extends unknown[],
>({
  lastfm: reportHook,
  userName,
  queryClass,
}: FlipCardReportContainerProps<ReportEncapsulation, ReportDataType>) {
  const analytics = useAnalytics();
  const flipCardController = useFlipCardController();
  const imagesController = useImagesController();
  const { t } = useTranslation("lastfm");
  const metrics = useMetrics();

  const query = new queryClass();

  useEffect(() => {
    imagesController.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reportHook.clear();
    query.startDataFetch(reportHook, userName);
    return () => reportHook.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reportHook.reportProperties.error === "TimeoutFetch") {
      query.startDataFetch(reportHook, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportHook]);

  useEffect(() => {
    if (
      !query.queryIsImagesLoaded(reportHook.reportProperties, imagesController)
    )
      return;
    if (!query.queryIsDataReady(reportHook.reportProperties)) return;
    reportHook.ready();
    metrics.increment("SearchMetric");
    analytics.event(
      Events.LastFM.ReportPresented(query.getAnalyticsReportType())
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesController.count, reportHook.reportProperties]);

  return (
    <LastFMErrorDisplayContainer<
      ReportDataType,
      LastFMFlipCardDrawerInterface<ReportEncapsulation>
    >
      query={query}
      reportProperties={reportHook.reportProperties}
    >
      <BillBoardSpinner
        titleText={t(
          `${String(query.getReportTranslationKey())}.communication`
        )}
        visible={!reportHook.reportProperties.ready}
      />
      <Condition isTrue={!reportHook.reportProperties.inProgress}>
        <FlipCardReport<ReportEncapsulation, ReportDataType>
          flipCardController={flipCardController}
          imageIsLoaded={imagesController.load}
          query={query}
          reportStateInstance={query.getEncapsulatedReportState(
            reportHook.reportProperties,
            t
          )}
          t={t}
        />
      </Condition>
    </LastFMErrorDisplayContainer>
  );
}
