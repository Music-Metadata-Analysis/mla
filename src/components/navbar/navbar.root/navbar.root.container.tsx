import { useEffect } from "react";
import NavBar from "./navbar.root.component";
import useAnalytics from "@src/hooks/analytics";
import useAuth from "@src/hooks/auth";
import useLastFM from "@src/hooks/lastfm";
import useLocale from "@src/hooks/locale";
import useRouter from "@src/hooks/router";
import type { NavBarControllerHookType } from "../navbar.controllers/navbar.ui.controller";

interface NavBarRootContainerProps {
  config: { [index: string]: string };
  controller: NavBarControllerHookType;
}

export default function NavBarRootContainer({
  config,
  controller,
}: NavBarRootContainerProps) {
  const analytics = useAnalytics();
  const { status: authStatus, user } = useAuth();
  const { t: navBarT } = useLocale("navbar");
  const { userProperties } = useLastFM();
  const router = useRouter();

  const isTransaction = () =>
    !userProperties.ready || authStatus === "processing";

  useEffect(() => {
    if (isTransaction()) controller.controls.mobileMenu.setFalse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProperties, authStatus]);

  return (
    <NavBar
      analytics={{ trackButtonClick: analytics.trackButtonClick }}
      controls={controller.controls}
      config={config}
      navBarT={navBarT}
      transaction={isTransaction()}
      router={{ path: router.path }}
      rootReference={controller.rootReference}
      user={{
        name: user?.name,
        image: user?.image,
      }}
    />
  );
}