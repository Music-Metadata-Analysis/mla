import { useState, useEffect, FC } from "react";
import settings from "../../../../../config/lastfm";
import routes from "../../../../../config/routes";
import Events from "../../../../../events/events";
import useLastFM from "../../../../../hooks/lastfm";
import ErrorBoundary from "../../../../errors/boundary/error.boundary.component";
import type { userHookAsLastFM } from "../../../../../types/user/hook.types";

interface LastFMReportPage<T extends userHookAsLastFM> {
  NoUserComponent: FC;
  ReportContainer: FC<ReportContainerProps<T>>;
}

interface ReportContainerProps<T extends userHookAsLastFM> {
  userName: string;
  user: T;
}

export default function LastFMReportPage<T extends userHookAsLastFM>({
  NoUserComponent,
  ReportContainer,
}: LastFMReportPage<T>) {
  const [userName, setUserName] = useState<string | null | undefined>(
    undefined
  );
  const user = useLastFM() as T;

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
    <ErrorBoundary
      eventDefinition={Events.General.Error}
      route={routes.home}
      stateReset={user.clear}
    >
      <ReportContainer userName={userName} user={user} />
    </ErrorBoundary>
  );
}
