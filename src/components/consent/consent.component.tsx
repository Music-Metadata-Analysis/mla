import { Text } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { settings } from "../../config/cookies";
import useAnalytics from "../../hooks/analytics";
import useColours from "../../hooks/colour";

export const testIDs = {
  consentDialogue: "consentDialogue",
  consentMessageLine1: "consentMessageLine1",
  consentMessageLine2: "consentMessageLine2",
};

export default function Consent() {
  const analytics = useAnalytics();
  const { componentColour, buttonColour, consentColour } = useColours();
  const { t } = useTranslation("main");

  const chakraColourToCSS = (colour: string) => {
    const value = `var(--chakra-colors-${colour.replace(".", "-")})`;
    return value;
  };

  const accept = () => {
    analytics.setup();
  };

  useEffect(() => {
    const existingConsent = Cookies.get(settings.consentCookieName);
    if (existingConsent === "true") {
      accept();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <CookieConsent
      visible={"byCookieValue"}
      cookieName={settings.consentCookieName}
      onAccept={accept}
      style={{
        borderTopWidth: "1px",
        borderTopColor: chakraColourToCSS(buttonColour.border),
        borderTopStyle: "solid",
        background: chakraColourToCSS(componentColour.background),
        color: chakraColourToCSS(componentColour.foreground),
        zIndex: 999,
        flexDirection: "column",
      }}
      buttonStyle={{
        background: chakraColourToCSS(consentColour.accept.background),
        color: chakraColourToCSS(buttonColour.foreground),
      }}
      contentStyle={{
        flex: "1 0",
      }}
      declineButtonStyle={{
        background: chakraColourToCSS(consentColour.decline.background),
        color: chakraColourToCSS(buttonColour.foreground),
      }}
      setDeclineCookie={false}
      enableDeclineButton
      buttonText={t("analytics.acceptMessage")}
      declineButtonText={t("analytics.declineMessage")}
    >
      <Text
        data-testid={testIDs.consentMessageLine1}
        fontSize={["xs", "sm", "m"]}
      >
        {t("analytics.message1")}
      </Text>
      <Text
        data-testid={testIDs.consentMessageLine2}
        fontSize={["sm", "m", "l"]}
      >
        <strong>{t("analytics.message2")}</strong>
      </Text>
    </CookieConsent>
  );
}
