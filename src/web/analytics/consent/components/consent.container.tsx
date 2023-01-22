import Cookies from "js-cookie";
import { useEffect } from "react";
import Consent from "./consent.component";
import { settings } from "@src/config/cookies";
import useLocale from "@src/hooks/locale.hook";
import useAnalytics from "@src/web/analytics/collection/state/hooks/analytics.hook";

export default function ConsentContainer() {
  const analytics = useAnalytics();
  const { t } = useLocale("main");

  const onAccept = () => {
    analytics.setup();
  };

  useEffect(() => {
    const previousConsent = Cookies.get(settings.consentCookieName);
    if (previousConsent === "true") {
      onAccept();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Consent
      acceptButtonText={t("analytics.acceptMessage")}
      declineButtonText={t("analytics.declineMessage")}
      consentMessageLine1Text={t("analytics.message1")}
      consentMessageLine2Text={t("analytics.message2")}
      onAccept={onAccept}
    />
  );
}
