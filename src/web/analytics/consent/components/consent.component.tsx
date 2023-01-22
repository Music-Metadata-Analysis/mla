import { Text } from "@chakra-ui/react";
import CookieConsent from "react-cookie-consent";
import { testIDs } from "./consent.identifiers";
import { settings } from "@src/config/cookies";
import useColours from "@src/hooks/ui/colour.hook";

export interface ConsentProps {
  acceptButtonText: string;
  declineButtonText: string;
  consentMessageLine1Text: string;
  consentMessageLine2Text: string;
  onAccept: () => void;
}

export default function Consent({
  acceptButtonText,
  declineButtonText,
  consentMessageLine1Text,
  consentMessageLine2Text,
  onAccept,
}: ConsentProps) {
  const {
    utilities: { colourToCSS },
    componentColour,
    buttonColour,
    consentColour,
  } = useColours();

  return (
    <CookieConsent
      visible={"byCookieValue"}
      cookieName={settings.consentCookieName}
      onAccept={onAccept}
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
      buttonText={acceptButtonText}
      declineButtonText={declineButtonText}
    >
      <Text
        data-testid={testIDs.consentMessageLine1}
        fontSize={["xs", "sm", "m"]}
      >
        {consentMessageLine1Text}
      </Text>
      <Text
        data-testid={testIDs.consentMessageLine2}
        fontSize={["sm", "m", "l"]}
      >
        <strong>{consentMessageLine2Text}</strong>
      </Text>
    </CookieConsent>
  );
}
