import { useState, useEffect, FC } from "react";
import ErrorBoundaryContainer from "@src/components/errors/boundary/error.boundary.container";
import settings from "@src/config/lastfm";
import routes from "@src/config/routes";
import Events from "@src/web/analytics/collection/events/definitions";
import useLastFM from "@src/web/reports/lastfm/generics/state/hooks/lastfm.hook";
import type { userHookAsLastFM } from "@src/types/user/hook.types";

interface LastFMReportPage<T extends userHookAsLastFM> {
  NoUserComponent: FC;
  ReportContainer: FC<ReportContainerProps<T>>;
}

interface ReportContainerProps<T extends userHookAsLastFM> {
  userName: string;
  lastfm: T;
}

export default function LastFMReportPage<T extends userHookAsLastFM>({
  NoUserComponent,
  ReportContainer,
}: LastFMReportPage<T>) {
  const [userName, setUserName] = useState<string | null | undefined>(
    undefined
  );
  const reportHook = useLastFM() as T;

  useEffect(() => {
    if (userName === undefined) {
      const urlParams = new URLSearchParams(window.location.search);
      setUserName(urlParams.get(settings.search.fieldName));
    }
  }, [userName]);

  if (userName === undefined) {
    return null;
  }

  if (userName === null) {
    return <NoUserComponent />;
  }

  return (
    <ErrorBoundaryContainer
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={reportHook.clear}
    >
      <ReportContainer userName={userName} lastfm={reportHook} />
    </ErrorBoundaryContainer>
  );
}
