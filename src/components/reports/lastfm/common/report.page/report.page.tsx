import { useState, useEffect, FC } from "react";
import ErrorBoundary from "@src/components/errors/boundary/error.boundary.component";
import settings from "@src/config/lastfm";
import routes from "@src/config/routes";
import Events from "@src/events/events";
import useLastFM from "@src/hooks/lastfm";
import type { userHookAsLastFM } from "@src/types/user/hook.types";

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
