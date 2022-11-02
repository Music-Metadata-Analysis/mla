import { useEffect } from "react";
import FlipCardReport from "./flip.card.report.component";
import Authentication from "@src/components/authentication/authentication.container";
import BillBoardSpinner from "@src/components/billboard/billboard.spinner/billboard.spinner.component";
import ErrorDisplay from "@src/components/errors/display/error.display.component";
import Events from "@src/events/events";
import useAnalytics from "@src/hooks/analytics";
import useImagesController from "@src/hooks/images";
import useLocale from "@src/hooks/locale";
import useMetrics from "@src/hooks/metrics";
import useRouter from "@src/hooks/router";
import type FlipCardBaseReport from "../flip.card.report/flip.card.report.base.class";
import type UserState from "@src/providers/user/encapsulations/lastfm/flipcard/user.state.base.flipcard.report.class";
import type { IntegrationRequestType } from "@src/types/analytics.types";
import type { userHookAsLastFM } from "@src/types/user/hook.types";

interface FlipCardReportProps<T extends UserState> {
  userName: string;
  user: userHookAsLastFM;
  reportClass: new () => FlipCardBaseReport<T>;
}

export default function FlipCardReportContainer<
  UserStateType extends UserState
>({ user, userName, reportClass }: FlipCardReportProps<UserStateType>) {
  const analytics = useAnalytics();
  const { t } = useLocale("lastfm");
  const metrics = useMetrics();
  const report = new reportClass();
  const router = useRouter();
  const imagesController = useImagesController();

  useEffect(() => {
    imagesController.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    user.clear();
    report.startDataFetch(user, userName);
    return () => user.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user.userProperties.error === "TimeoutFetch") {
      report.startDataFetch(user, userName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (report.queryIsDataReady(user.userProperties, imagesController)) {
      user.ready();
      metrics.increment("SearchMetric");
      analytics.event(
        Events.LastFM.ReportPresented(
          report.analyticsReportType as IntegrationRequestType
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesController.count, user.userProperties]);

  if (user.userProperties.error === "RatelimitedFetch") {
    return (
      <ErrorDisplay
        errorKey={"lastfmRatelimited"}
        resetError={() => router.reload()}
      />
    );
  }

  if (user.userProperties.error === "NotFoundFetch") {
    return (
      <ErrorDisplay
        errorKey={"userNotFound"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  if (user.userProperties.error === "FailureFetch") {
    return (
      <ErrorDisplay
        errorKey={"lastfmCommunications"}
        resetError={() => router.push(report.getRetryRoute())}
      />
    );
  }

  if (user.userProperties.error === "UnauthorizedFetch") {
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
        imageIsLoaded={imagesController.load}
        visible={user.userProperties.ready}
        userState={report.getEncapsulatedUserState(user.userProperties, t)}
        t={t}
      />
    </>
  );
}
