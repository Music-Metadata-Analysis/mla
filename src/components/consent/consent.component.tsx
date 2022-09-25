import { Text } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { settings } from "@src/config/cookies";
import useAnalytics from "@src/hooks/analytics";
import useColours from "@src/hooks/colour";
import useLocale from "@src/hooks/locale";

export const testIDs = {
  consentDialogue: "consentDialogue",
  consentMessageLine1: "consentMessageLine1",
  consentMessageLine2: "consentMessageLine2",
};

export default function Consent() {
  const analytics = useAnalytics();
  const {
    utilities: { colourToCSS },
    componentColour,
    buttonColour,
    consentColour,
  } = useColours();
  const { t } = useLocale("main");

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
        borderTopColor: colourToCSS(buttonColour.border),
        borderTopStyle: "solid",
        background: colourToCSS(componentColour.background),
        color: colourToCSS(componentColour.foreground),
        zIndex: 999,
        flexDirection: "column",
      }}
      buttonStyle={{
        background: colourToCSS(consentColour.accept.background),
        color: colourToCSS(buttonColour.foreground),
      }}
      contentStyle={{
        flex: "1 0",
      }}
      declineButtonStyle={{
        background: colourToCSS(consentColour.decline.background),
        color: colourToCSS(buttonColour.foreground),
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
