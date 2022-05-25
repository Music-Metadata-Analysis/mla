import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SunBurstReport from "./sunburst.report.component";
import Events from "../../../../../events/events";
import useAnalytics from "../../../../../hooks/analytics";
import useMetrics from "../../../../../hooks/metrics";
import BillBoardProgressBar from "../../../../billboard/billboard.progress.bar/billboard.progress.bar.component";
import AggregateErrorDisplay from "../error.displays/aggregate.error.display.component";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/sunburst/user.state.base.sunburst.report.class";
import type { IntegrationRequestType } from "../../../../../types/analytics.types";
import type { AggregateBaseReportResponseInterface } from "../../../../../types/integrations/base.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type { BillBoardProgressBarDetails } from "../../../../billboard/billboard.progress.bar/billboard.progress.bar.component";
import type SunBurstBaseReport from "./sunburst.report.base.class";

interface SunBurstReportContainerProps<T extends UserState<unknown>> {
  userName: string;
  user: userHookAsLastFM;
  reportClass: new () => SunBurstBaseReport<T>;
}

export default function SunBurstReportContainer<
  UserStateType extends UserState<unknown>
>({
  user,
  userName,
  reportClass,
}: SunBurstReportContainerProps<UserStateType>) {
  const analytics = useAnalytics();
  const { t: lastFMt } = useTranslation("lastfm");
  const { t: sunBurstT } = useTranslation("sunburst");
  const metrics = useMetrics();
  const report = new reportClass();
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressDetails, setProgressDetails] =
    useState<BillBoardProgressBarDetails>({
      resource: "",
      type: "",
    });

  useEffect(() => {
    user.clear();
    report.startDataFetch(user, userName);
    return () => user.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentProgress = report.getProgressPercentage(user.userProperties);
    setProgressPercent(currentProgress);
    setProgressDetails(
      report.getProgressDetails(user.userProperties, sunBurstT)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProperties]);

  useEffect(() => {
    if (report.queryIsResumable(user.userProperties)) {
      report.startDataFetch(user, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProperties]);

  useEffect(() => {
    if (report.queryIsDataReady(user.userProperties)) {
      user.ready();
      metrics.increment("SearchMetric");
      analytics.event(
        Events.LastFM.ReportPresented(
          report.analyticsReportType as IntegrationRequestType
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.userProperties]);

  const errorDisplay = AggregateErrorDisplay<
    AggregateBaseReportResponseInterface<unknown>
  >({
    report,
    userProperties: user.userProperties,
  });
  if (errorDisplay) return errorDisplay;

  return (
    <>
      <BillBoardProgressBar
        title={lastFMt(
          `${String(report.getReportTranslationKey())}.communication`
        )}
        visible={!user.userProperties.ready}
        value={progressPercent}
        details={progressDetails}
      />
      <SunBurstReport<UserStateType>
        report={report}
        visible={user.userProperties.ready}
        userState={report.getEncapsulatedUserState(user.userProperties)}
        lastFMt={lastFMt}
        sunBurstT={sunBurstT}
      />
    </>
  );
}
