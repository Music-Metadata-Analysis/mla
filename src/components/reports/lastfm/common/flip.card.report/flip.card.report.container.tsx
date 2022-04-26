import { useRouter } from "next/router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import FlipCardReport from "./flip.card.report.component";
import Events from "../../../../../events/events";
import useAnalytics from "../../../../../hooks/analytics";
import useMetrics from "../../../../../hooks/metrics";
import useUserInterface from "../../../../../hooks/ui";
import Authentication from "../../../../authentication/authentication.container";
import BillBoardSpinner from "../../../../billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "../../../../errors/display/error.display.component";
import type UserState from "../../../../../providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { ReportType } from "../../../../../types/analytics.types";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";
import type FlipCardBaseReport from "../flip.card.report/flip.card.report.base.class";

interface FlipCardReportProps<T extends UserState> {
  userName: string;
  user: userHookAsLastFM;
  reportClass: new () => FlipCardBaseReport<T>;
}

export default function FlipCardReportContainer<
  UserStateType extends UserState
>({ user, userName, reportClass }: FlipCardReportProps<UserStateType>) {
  const analytics = useAnalytics();
  const { t } = useTranslation("lastfm");
  const metrics = useMetrics();
  const report = new reportClass();
  const router = useRouter();
  const ui = useUserInterface();

  useEffect(() => {
    ui.images.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    user.clear();
    report.startDataFetch(user, userName);
    return () => user.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user.userProperties.error === "TimeoutFetchUser") {
      report.startDataFetch(user, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (report.queryIsDataReady(user.userProperties, ui)) {
      user.ready();
      metrics.increment("SearchMetric");
      analytics.event(
        Events.LastFM.ReportPresented(report.analyticsReportType as ReportType)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ui.images.count, user.userProperties]);

  if (user.userProperties.error === "RatelimitedFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"lastfmRatelimited"}
        resetError={() => router.reload()}
      />
    );
  }

  if (user.userProperties.error === "NotFoundFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"userNotFound"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  if (user.userProperties.error === "FailureFetchUser") {
    return (
      <ErrorDisplay
        errorKey={"lastfmCommunications"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  if (user.userProperties.error === "UnauthorizedFetchUser") {
    return <Authentication />;
  }

  if (!report.queryUserHasData(user.userProperties)) {
    return (
      <ErrorDisplay
        errorKey={"userWithNoListens"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  return (
    <>
      <BillBoardSpinner
        title={t(`${String(report.getReportTranslationKey())}.communication`)}
        visible={!user.userProperties.ready}
      />
      <FlipCardReport<UserStateType>
        report={report}
        imageIsLoaded={ui.images.load}
        visible={user.userProperties.ready}
        userState={report.getEncapsulatedUserState(user.userProperties, t)}
        t={t}
      />
    </>
  );
}
