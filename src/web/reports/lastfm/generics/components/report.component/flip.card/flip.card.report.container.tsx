import { useEffect } from "react";
import FlipCardReport from "./flip.card.report.component";
import BillBoardSpinner from "@src/components/billboard/billboard.spinner/billboard.spinner.component";
import Condition from "@src/components/condition/condition.component";
import useImagesController from "@src/hooks/controllers/images.controller.hook";
import Events from "@src/web/analytics/collection/events/definitions";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";
import useTranslation from "@src/web/locale/translation/hooks/translation.hook";
import useMetrics from "@src/web/metrics/collection/state/hooks/metrics.hook";
import LastFMErrorDisplayContainer from "@src/web/reports/lastfm/generics/components/error.display/error.display.container";
import useFlipCardController from "@src/web/reports/lastfm/generics/components/report.component/flip.card/controllers/flip.card.controller.hook";
import type { userHookAsLastFM } from "@src/types/user/hook.types";
import type FlipCardBaseReportState from "@src/web/reports/generics/state/providers/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type FlipCardBaseReport from "@src/web/reports/lastfm/generics/state/queries/flip.card.query.base.class";
import type { LastFMFlipCardDrawerInterface } from "@src/web/reports/lastfm/generics/types/components/drawer/flip.card.types";

export interface FlipCardReportContainerProps<
  T extends FlipCardBaseReportState,
  R extends unknown[]
> {
  userName: string;
  lastfm: userHookAsLastFM;
  reportClass: new () => FlipCardBaseReport<T, R>;
}

export default function FlipCardReportContainer<
  UserStateType extends FlipCardBaseReportState,
  ReportDataType extends unknown[]
>({
  lastfm: reportHook,
  userName,
  reportClass,
}: FlipCardReportContainerProps<UserStateType, ReportDataType>) {
  const analytics = useAnalytics();
  const flipCardController = useFlipCardController();
  const imagesController = useImagesController();
  const { t } = useTranslation("lastfm");
  const metrics = useMetrics();
  const report = new reportClass();

  useEffect(() => {
    imagesController.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    reportHook.clear();
    report.startDataFetch(reportHook, userName);
    return () => reportHook.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (reportHook.userProperties.error === "TimeoutFetch") {
      report.startDataFetch(reportHook, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportHook]);

  useEffect(() => {
    if (
      !report.queryIsImagesLoaded(reportHook.userProperties, imagesController)
    )
      return;
    if (!report.queryIsDataReady(reportHook.userProperties)) return;
    reportHook.ready();
    metrics.increment("SearchMetric");
    analytics.event(
      Events.LastFM.ReportPresented(report.getAnalyticsReportType())
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesController.count, reportHook.userProperties]);

  return (
    <LastFMErrorDisplayContainer<
      ReportDataType,
      LastFMFlipCardDrawerInterface<UserStateType>
    >
      report={report}
      userProperties={reportHook.userProperties}
    >
      <BillBoardSpinner
        titleText={t(
          `${String(report.getReportTranslationKey())}.communication`
        )}
        visible={!reportHook.userProperties.ready}
      />
      <Condition isTrue={!reportHook.userProperties.inProgress}>
        <FlipCardReport<UserStateType, ReportDataType>
          flipCardController={flipCardController}
          imageIsLoaded={imagesController.load}
          report={report}
          reportStateInstance={report.getEncapsulatedReportState(
            reportHook.userProperties,
            t
          )}
          t={t}
        />
      </Condition>
    </LastFMErrorDisplayContainer>
  );
}
