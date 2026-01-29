import { useState, useEffect } from "react";
import settings from "@src/config/lastfm";
import routes from "@src/config/routes";
import Events from "@src/web/analytics/collection/events/definitions";
import useAuth from "@src/web/authentication/session/hooks/auth.hook";
import Authentication from "@src/web/authentication/sign.in/components/authentication.container";
import useLastFM from "@src/web/reports/lastfm/generics/state/hooks/lastfm.hook";
import ErrorBoundaryContainer from "@src/web/ui/errors/components/boundary/error.boundary.container";
import type { reportHookAsLastFM } from "@src/web/reports/lastfm/generics/types/state/hooks/lastfm.hook.types";
import type { FC } from "react";

interface LastFMReportPage<T extends reportHookAsLastFM> {
  NoUserComponent: FC;
  ReportContainer: FC<ReportContainerProps<T>>;
}

interface ReportContainerProps<T extends reportHookAsLastFM> {
  userName: string;
  lastfm: T;
}

export default function LastFMReportPage<T extends reportHookAsLastFM>({
  NoUserComponent,
  ReportContainer,
}: LastFMReportPage<T>) {
  const { status } = useAuth();
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

  if (status !== "authenticated") return <Authentication />;

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
