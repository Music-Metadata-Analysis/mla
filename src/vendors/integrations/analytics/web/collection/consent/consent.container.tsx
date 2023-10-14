import Cookies from "js-cookie";
import { useEffect } from "react";
import Consent from "./consent.component";
import { settings } from "@src/config/cookies";
import { analyticsVendor } from "@src/vendors/integrations/analytics/vendor";
import { localeVendor } from "@src/vendors/integrations/locale/vendor";

export default function ConsentContainer() {
  const { t } = localeVendor.hook("main");

  const { setup } = analyticsVendor.collection.hook(
    analyticsVendor.ClientClass
  );

  useEffect(() => {
    const previousConsent = Cookies.get(settings.consentCookieName);
    if (previousConsent === "true") {
      setup();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Consent
      acceptButtonText={t("analytics.acceptMessage")}
      declineButtonText={t("analytics.declineMessage")}
      consentMessageLine1Text={t("analytics.message1")}
      consentMessageLine2Text={t("analytics.message2")}
      onAccept={setup}
    />
  );
}
